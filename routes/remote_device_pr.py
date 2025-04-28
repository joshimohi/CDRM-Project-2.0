from flask import Blueprint, jsonify, request, current_app, Response
import os
import yaml
from pyplayready.device import Device as PlayReadyDevice
from pyplayready.cdm import Cdm as PlayReadyCDM
from pyplayready import PSSH as PlayReadyPSSH
from pyplayready.exceptions import (InvalidSession, TooManySessions, InvalidLicense, InvalidPssh)



remotecdm_pr_bp = Blueprint('remotecdm_pr', __name__)
with open(f'{os.getcwd()}/configs/config.yaml', 'r') as file:
    config = yaml.safe_load(file)

@remotecdm_pr_bp.route('/remotecdm/playready', methods=['GET', 'HEAD'])
def remote_cdm_playready():
    if request.method == 'GET':
        return jsonify({
            'message': 'OK'
        })
    if request.method == 'HEAD':
        response = Response(status=200)
        response.headers['Server'] = 'playready serve'
        return response


@remotecdm_pr_bp.route('/remotecdm/playready/deviceinfo', methods=['GET'])
def remote_cdm_playready_deviceinfo():
    base_name = config["default_pr_cdm"]
    if not base_name.endswith(".prd"):
        full_file_name = (base_name + ".prd")
    device = PlayReadyDevice.load(f'{os.getcwd()}/configs/CDMs/PR/{full_file_name}')
    cdm = PlayReadyCDM.from_device(device)
    return jsonify({
        'security_level': cdm.security_level,
        'host': f'{config["fqdn"]}/remotecdm/playready',
        'secret': f'{config["remote_cdm_secret"]}',
        'device_name': f'{base_name}'
    })

@remotecdm_pr_bp.route('/remotecdm/playready/<device>/open', methods=['GET'])
def remote_cdm_playready_open(device):
    if str(device).lower() == config['default_pr_cdm'].lower():
        pr_device = PlayReadyDevice.load(f'{os.getcwd()}/configs/CDMs/PR/{config["default_pr_cdm"]}.prd')
        cdm = current_app.config['CDM'] = PlayReadyCDM.from_device(pr_device)
        session_id = cdm.open()
        return jsonify({
            'message': 'Success',
            'data': {
                'session_id': session_id.hex(),
                'device': {
                    'security_level': cdm.security_level
                }
            }
        })

@remotecdm_pr_bp.route('/remotecdm/playready/<device>/close/<session_id>', methods=['GET'])
def remote_cdm_playready_close(device, session_id):
    if str(device).lower() == config['default_pr_cdm'].lower():
        session_id = bytes.fromhex(session_id)
        cdm = current_app.config["CDM"]
        if not cdm:
            return jsonify({
                'status': 400,
                'message': f'No CDM for "{device}" has been opened yet. No session to close'
            })
        try:
            cdm.close(session_id)
        except InvalidSession:
            return jsonify({
                'status': 400,
                'message': f'Invalid session ID "{session_id.hex()}", it may have expired'
            })
        return jsonify({
            'status': 200,
            'message': f'Successfully closed Session "{session_id.hex()}".',
        })
    else:
        return jsonify({
            'status': 400,
            'message': f'Unauthorized'
        })

@remotecdm_pr_bp.route('/remotecdm/playready/<device>/get_license_challenge', methods=['POST'])
def remote_cdm_playready_get_license_challenge(device):
    if str(device).lower() == config['default_pr_cdm'].lower():
        body = request.get_json()
        for required_field in ("session_id", "init_data"):
            if not body.get(required_field):
                return jsonify({
                    'status': 400,
                    'message': f'Missing required field "{required_field}" in JSON body'
                })
        cdm = current_app.config["CDM"]
        session_id = bytes.fromhex(body["session_id"])
        init_data = body["init_data"]
        if not init_data.startswith("<WRMHEADER"):
            try:
                pssh = PlayReadyPSSH(init_data)
                if pssh.wrm_headers:
                    init_data = pssh.wrm_headers[0]
            except InvalidPssh as e:
                return jsonify({
                    'message': f'Unable to parse base64 PSSH, {e}'
                })
        try:
            license_request = cdm.get_license_challenge(
                session_id=session_id,
                wrm_header=init_data
            )
        except InvalidSession:
            return jsonify({
                'message': f"Invalid Session ID '{session_id.hex()}', it may have expired."
            })
        except Exception as e:
            return jsonify({
                'message': f'Error, {e}'
            })
        return jsonify({
            'message': 'success',
            'data': {
                'challenge': license_request
            }
        })

@remotecdm_pr_bp.route('/remotecdm/playready/<device>/parse_license', methods=['POST'])
def remote_cdm_playready_parse_license(device):
    if str(device).lower() == config['default_pr_cdm'].lower():
        body = request.get_json()
        for required_field in ("license_message", "session_id"):
            if not body.get(required_field):
                return jsonify({
                    'message': f'Missing required field "{required_field}" in JSON body'
                })
        cdm = current_app.config["CDM"]
        if not cdm:
            return jsonify({
                'message': f"No Cdm session for {device} has been opened yet. No session to use."
            })
        session_id = bytes.fromhex(body["session_id"])
        license_message = body["license_message"]
        try:
            cdm.parse_license(session_id, license_message)
        except InvalidSession:
            return jsonify({
                'message': f"Invalid Session ID '{session_id.hex()}', it may have expired."
            })
        except InvalidLicense as e:
            return jsonify({
                'message': f"Invalid License, {e}"
            })
        except Exception as e:
            return jsonify({
                'message': f"Error, {e}"
            })
        return jsonify({
            'message': 'Successfully parsed and loaded the Keys from the License message'
        })

@remotecdm_pr_bp.route('/remotecdm/playready/<device>/get_keys', methods=['POST'])
def remote_cdm_playready_get_keys(device):
    if str(device).lower() == config['default_pr_cdm'].lower():
        body = request.get_json()
        for required_field in ("session_id",):
            if not body.get(required_field):
                return jsonify({
                    'message': f'Missing required field "{required_field}" in JSON body'
                })
        session_id = bytes.fromhex(body["session_id"])
        cdm = current_app.config["CDM"]
        if not cdm:
            return jsonify({
                'message': f"Missing required field '{required_field}' in JSON body."
            })
        try:
            keys = cdm.get_keys(session_id)
        except InvalidSession:
            return jsonify({
                'message': f"Invalid Session ID '{session_id.hex()}', it may have expired."
            })
        except Exception as e:
            return jsonify({
                'message': f"Error, {e}"
            })
        keys_json = [
            {
                "key_id": key.key_id.hex,
                "key": key.key.hex(),
                "type": key.key_type.value,
                "cipher_type": key.cipher_type.value,
                "key_length": key.key_length,
            }
            for key in keys
        ]
        return jsonify({
            'message': 'success',
            'data': {
                'keys': keys_json
            }
        })