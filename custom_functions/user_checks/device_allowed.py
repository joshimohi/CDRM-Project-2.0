import os
import glob

def user_allowed_to_use_device(device, username):
    base_path = os.path.join(os.getcwd(), 'configs', 'CDMs', username)

    # Get filenames with extensions
    pr_files = [os.path.basename(f) for f in glob.glob(os.path.join(base_path, 'PR', '*.prd'))]
    wv_files = [os.path.basename(f) for f in glob.glob(os.path.join(base_path, 'WV', '*.wvd'))]

    # Combine all filenames
    all_files = pr_files + wv_files

    # Check if filename matches directly or by adding extensions
    possible_names = {device, f"{device}.prd", f"{device}.wvd"}

    return any(name in all_files for name in possible_names)