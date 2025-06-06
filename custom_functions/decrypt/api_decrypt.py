from pywidevine.cdm import Cdm as widevineCdm
from pywidevine.device import Device as widevineDevice
from pywidevine.pssh import PSSH as widevinePSSH
from pyplayready.cdm import Cdm as playreadyCdm
from pyplayready.device import Device as playreadyDevice
from pyplayready.system.pssh import PSSH as playreadyPSSH
import requests
import base64
import ast
import glob
import os
import yaml
from urllib.parse import urlparse





def find_license_key(data, keywords=None):
    if keywords is None:
        keywords = ["license", "licenseData", "widevine2License"]  # Default list of keywords to search for

    # If the data is a dictionary, check each key
    if isinstance(data, dict):
        for key, value in data.items():
            if any(keyword in key.lower() for keyword in
                   keywords):  # Check if any keyword is in the key (case-insensitive)
                return value.replace("-", "+").replace("_", "/")  # Return the value immediately when found
            # Recursively check if the value is a dictionary or list
            if isinstance(value, (dict, list)):
                result = find_license_key(value, keywords)  # Recursively search
                if result:  # If a value is found, return it
                    return result.replace("-", "+").replace("_", "/")

    # If the data is a list, iterate through each item
    elif isinstance(data, list):
        for item in data:
            result = find_license_key(item, keywords)  # Recursively search
            if result:  # If a value is found, return it
                return result.replace("-", "+").replace("_", "/")

    return None  # Return None if no matching key is found


def find_license_challenge(data, keywords=None, new_value=None):
    if keywords is None:
        keywords = ["license", "licenseData", "widevine2License", "licenseRequest"]  # Default list of keywords to search for

    # If the data is a dictionary, check each key
    if isinstance(data, dict):
        for key, value in data.items():
            if any(keyword in key.lower() for keyword in keywords):  # Check if any keyword is in the key (case-insensitive)
                data[key] = new_value  # Modify the value in-place
            # Recursively check if the value is a dictionary or list
            elif isinstance(value, (dict, list)):
                find_license_challenge(value, keywords, new_value)  # Recursively modify in place

    # If the data is a list, iterate through each item
    elif isinstance(data, list):
        for i, item in enumerate(data):
            result = find_license_challenge(item, keywords, new_value)  # Recursively modify in place

    return data  # Return the modified original data (no new structure is created)


def is_base64(string):
    try:
        # Try decoding the string
        decoded_data = base64.b64decode(string)
        # Check if the decoded data, when re-encoded, matches the original string
        return base64.b64encode(decoded_data).decode('utf-8') == string
    except Exception:
        # If decoding or encoding fails, it's not Base64
        return False

def is_url_and_split(input_str):
    parsed = urlparse(input_str)

    # Check if it's a valid URL with scheme and netloc
    if parsed.scheme and parsed.netloc:
        protocol = parsed.scheme
        fqdn = parsed.netloc
        return True, protocol, fqdn
    else:
        return False, None, None

def api_decrypt(pssh:str = None, license_url: str = None, proxy: str = None, headers: str = None, cookies: str = None, json_data: str = None, device: str = 'public', username: str = None):
    print(f'Using device {device} for user {username}')
    with open(f'{os.getcwd()}/configs/config.yaml', 'r') as file:
        config = yaml.safe_load(file)
    if config['database_type'].lower() == 'sqlite':
        from custom_functions.database.cache_to_db_sqlite import cache_to_db
    elif config['database_type'].lower() == 'mariadb':
        from custom_functions.database.cache_to_db_mariadb import cache_to_db
    if pssh is None:
        return {
            'status': 'error',
            'message': 'No PSSH provided'
        }
    try:
        if "</WRMHEADER>".encode("utf-16-le") in base64.b64decode(pssh):  # PR
            try:
                pr_pssh = playreadyPSSH(pssh)
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred processing PSSH\n\n{error}'
                }
            try:
                if device == 'public':
                    base_name = config["default_pr_cdm"]
                    if not base_name.endswith(".prd"):
                        base_name += ".prd"
                        prd_files = glob.glob(f'{os.getcwd()}/configs/CDMs/PR/{base_name}')
                    else:
                        prd_files = glob.glob(f'{os.getcwd()}/configs/CDMs/PR/{base_name}')
                    if prd_files:
                        pr_device = playreadyDevice.load(prd_files[0])
                    else:
                        return {
                            'status': 'error',
                            'message': 'No default .prd file found'
                        }
                else:
                    base_name = device
                    if not base_name.endswith(".prd"):
                        base_name += ".prd"
                        prd_files = glob.glob(f'{os.getcwd()}/configs/CDMs/{username}/PR/{base_name}')
                    else:
                        prd_files = glob.glob(f'{os.getcwd()}/configs/CDMs/{username}/PR/{base_name}')
                    if prd_files:
                        pr_device = playreadyDevice.load(prd_files[0])
                    else:
                        return {
                            'status': 'error',
                            'message': f'{base_name} does not exist'
                        }
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred location PlayReady CDM file\n\n{error}'
                }
            try:
                pr_cdm = playreadyCdm.from_device(pr_device)
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred loading PlayReady CDM\n\n{error}'
                }
            try:
                pr_session_id = pr_cdm.open()
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred opening a CDM session\n\n{error}'
                }
            try:
                pr_challenge = pr_cdm.get_license_challenge(pr_session_id, pr_pssh.wrm_headers[0])
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred getting license challenge\n\n{error}'
                }
            try:
                if headers:
                    format_headers = ast.literal_eval(headers)
                else:
                    format_headers = None
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred getting headers\n\n{error}'
                }
            try:
                if cookies:
                    format_cookies = ast.literal_eval(cookies)
                else:
                    format_cookies = None
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred getting cookies\n\n{error}'
                }
            try:
                if json_data and not is_base64(json_data):
                    format_json_data = ast.literal_eval(json_data)
                else:
                    format_json_data = None
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred getting json_data\n\n{error}'
                }
            licence = None
            proxies = None
            if proxy is not None:
                is_url, protocol, fqdn = is_url_and_split(proxy)
                if is_url:
                    proxies = {'http': proxy, 'https': proxy}
                else:
                    return {
                        'status': 'error',
                        'message': f'Your proxy is invalid, please put it in the format of http(s)://fqdn.tld:port'
                    }
            try:
                licence = requests.post(
                    url=license_url,
                    headers=format_headers,
                    proxies=proxies,
                    cookies=format_cookies,
                    json=format_json_data if format_json_data is not None else None,
                    data=pr_challenge if format_json_data is None else None
                )
            except requests.exceptions.ConnectionError as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred sending license challenge through your proxy\n\n{error}'
                }
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred sending license reqeust\n\n{error}\n\n{licence.content}'
                }
            try:
                pr_cdm.parse_license(pr_session_id, licence.text)
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred parsing license content\n\n{error}\n\n{licence.content}'
                }
            returned_keys = ""
            try:
                keys = list(pr_cdm.get_keys(pr_session_id))
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred getting keys\n\n{error}'
                }
            try:
                for index, key in enumerate(keys):
                    if key.key_type != 'SIGNING':
                        cache_to_db(pssh=pssh, license_url=license_url, headers=headers, cookies=cookies,
                                    data=pr_challenge if json_data is None else json_data, kid=key.key_id.hex,
                                    key=key.key.hex())
                        if index != len(keys) - 1:
                            returned_keys += f"{key.key_id.hex}:{key.key.hex()}\n"
                        else:
                            returned_keys += f"{key.key_id.hex}:{key.key.hex()}"
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred formatting keys\n\n{error}'
                }
            try:
                pr_cdm.close(pr_session_id)
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred closing session\n\n{error}'
                }
            try:
                return {
                    'status': 'success',
                    'message': returned_keys
                }
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred getting returned_keys\n\n{error}'
                }
    except Exception as error:
        return {
            'status': 'error',
            'message': f'An error occurred processing PSSH\n\n{error}'
        }
    else:
        try:
            wv_pssh = widevinePSSH(pssh)
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred processing PSSH\n\n{error}'
            }
        try:
            if device == 'public':
                base_name = config["default_wv_cdm"]
                if not base_name.endswith(".wvd"):
                    base_name += ".wvd"
                    wvd_files = glob.glob(f'{os.getcwd()}/configs/CDMs/WV/{base_name}')
                else:
                    wvd_files = glob.glob(f'{os.getcwd()}/configs/CDMs/WV/{base_name}')
                if wvd_files:
                    wv_device = widevineDevice.load(wvd_files[0])
                else:
                    return {
                        'status': 'error',
                        'message': 'No default .wvd file found'
                    }
            else:
                base_name = device
                if not base_name.endswith(".wvd"):
                    base_name += ".wvd"
                    wvd_files = glob.glob(f'{os.getcwd()}/configs/CDMs/{username}/WV/{base_name}')
                else:
                    wvd_files = glob.glob(f'{os.getcwd()}/configs/CDMs/{username}/WV/{base_name}')
                if wvd_files:
                    wv_device = widevineDevice.load(wvd_files[0])
                else:
                    return {
                        'status': 'error',
                        'message': f'{base_name} does not exist'
                    }
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred location Widevine CDM file\n\n{error}'
            }
        try:
            wv_cdm = widevineCdm.from_device(wv_device)
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred loading Widevine CDM\n\n{error}'
            }
        try:
            wv_session_id = wv_cdm.open()
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred opening a CDM session\n\n{error}'
            }
        try:
            wv_challenge = wv_cdm.get_license_challenge(wv_session_id, wv_pssh)
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred getting license challenge\n\n{error}'
            }
        try:
            if headers:
                format_headers = ast.literal_eval(headers)
            else:
                format_headers = None
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred getting headers\n\n{error}'
            }
        try:
            if cookies:
                format_cookies = ast.literal_eval(cookies)
            else:
                format_cookies = None
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred getting cookies\n\n{error}'
            }
        try:
            if json_data and not is_base64(json_data):
                format_json_data = ast.literal_eval(json_data)
                format_json_data = find_license_challenge(data=format_json_data, new_value=base64.b64encode(wv_challenge).decode())
            else:
                format_json_data = None
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred getting json_data\n\n{error}'
            }
        licence = None
        proxies = None
        if proxy is not None:
            is_url, protocol, fqdn = is_url_and_split(proxy)
            if is_url:
                proxies = {'http': proxy, 'https': proxy}
        try:
            licence = requests.post(
                url=license_url,
                headers=format_headers,
                proxies=proxies,
                cookies=format_cookies,
                json=format_json_data if format_json_data is not None else None,
                data=wv_challenge if format_json_data is None else None
            )
        except requests.exceptions.ConnectionError as error:
            return {
                'status': 'error',
                'message': f'An error occurred sending license challenge through your proxy\n\n{error}'
            }
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred sending license reqeust\n\n{error}\n\n{licence.content}'
            }
        try:
            wv_cdm.parse_license(wv_session_id, licence.content)
        except:
            try:
                license_json = licence.json()
                license_value = find_license_key(license_json)
                wv_cdm.parse_license(wv_session_id, license_value)
            except Exception as error:
                return {
                    'status': 'error',
                    'message': f'An error occurred parsing license content\n\n{error}\n\n{licence.content}'
                }
        returned_keys = ""
        try:
            keys = list(wv_cdm.get_keys(wv_session_id))
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred getting keys\n\n{error}'
            }
        try:
            for index, key in enumerate(keys):
                if key.type != 'SIGNING':
                    cache_to_db(pssh=pssh, license_url=license_url, headers=headers, cookies=cookies, data=wv_challenge if json_data is None else json_data, kid=key.kid.hex, key=key.key.hex())
                    if index != len(keys) - 1:
                        returned_keys += f"{key.kid.hex}:{key.key.hex()}\n"
                    else:
                        returned_keys += f"{key.kid.hex}:{key.key.hex()}"
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred formatting keys\n\n{error}'
            }
        try:
           wv_cdm.close(wv_session_id)
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred closing session\n\n{error}'
            }
        try:
            return {
                'status': 'success',
                'message': returned_keys
            }
        except Exception as error:
            return {
                'status': 'error',
                'message': f'An error occurred getting returned_keys\n\n{error}'
            }