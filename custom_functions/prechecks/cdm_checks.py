import os
import yaml
import requests



def check_for_wvd_cdm():
    with open(f'{os.getcwd()}/configs/config.yaml', 'r') as file:
        config = yaml.safe_load(file)
    if config['default_wv_cdm'] == '':
        exit(f"Please put the name of your Widevine CDM inside of {os.getcwd()}/configs/config.yaml")
    else:
        base_name = config["default_wv_cdm"]
        if not base_name.endswith(".wvd"):
            base_name += ".wvd"
        if os.path.exists(f'{os.getcwd()}/configs/CDMs/WV/{base_name}'):
            return
        else:
            exit(f"Widevine CDM {base_name} does not exist in {os.getcwd()}/configs/CDMs/WV")

def check_for_prd_cdm():
    with open(f'{os.getcwd()}/configs/config.yaml', 'r') as file:
        config = yaml.safe_load(file)
    if config['default_pr_cdm'] == '':
        exit(f"Please put the name of your PlayReady CDM inside of {os.getcwd()}/configs/config.yaml")
    else:
        base_name = config["default_pr_cdm"]
        if not base_name.endswith(".prd"):
            base_name += ".prd"
        if os.path.exists(f'{os.getcwd()}/configs/CDMs/PR/{base_name}'):
            return
        else:
            exit(f"PlayReady CDM {base_name} does not exist in {os.getcwd()}/configs/CDMs/WV")


def check_for_cdms():
    check_for_wvd_cdm()
    check_for_prd_cdm()