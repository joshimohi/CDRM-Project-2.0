from flask import Blueprint, request, jsonify, session
import os
import glob
import logging

user_info_bp = Blueprint('user_info_bp', __name__)

@user_info_bp.route('/userinfo', methods=['POST'])
def user_info():
    username = session.get('username')
    if not username:
        return jsonify({'message': 'False'}), 400

    try:
        base_path = os.path.join(os.getcwd(), 'configs', 'CDMs', username)
        pr_files = [os.path.basename(f) for f in glob.glob(os.path.join(base_path, 'PR', '*.prd'))]
        wv_files = [os.path.basename(f) for f in glob.glob(os.path.join(base_path, 'WV', '*.wvd'))]

        return jsonify({
            'Username': username,
            'Widevine_Devices': wv_files,
            'Playready_Devices': pr_files
        })
    except Exception as e:
        logging.exception("Error retrieving device files")
        return jsonify({'message': 'False'}), 500
