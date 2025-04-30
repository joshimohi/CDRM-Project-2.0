from flask import Blueprint, request, jsonify, session
import os
import logging

upload_bp = Blueprint('upload_bp', __name__)


@upload_bp.route('/upload/<cdmtype>', methods=['POST'])
def upload(cdmtype):
    try:
        username = session.get('username')
        if not username:
            return jsonify({'message': 'False', 'error': 'No username in session'}), 400

        # Validate CDM type
        if cdmtype not in ['PR', 'WV']:
            return jsonify({'message': 'False', 'error': 'Invalid CDM type'}), 400

        # Set up user directory paths
        base_path = os.path.join(os.getcwd(), 'configs', 'CDMs', username)
        pr_path = os.path.join(base_path, 'PR')
        wv_path = os.path.join(base_path, 'WV')

        # Create necessary directories if they don't exist
        os.makedirs(pr_path, exist_ok=True)
        os.makedirs(wv_path, exist_ok=True)

        # Get uploaded file
        uploaded_file = request.files.get('file')
        if not uploaded_file:
            return jsonify({'message': 'False', 'error': 'No file provided'}), 400

        # Determine correct save path based on cdmtype
        filename = uploaded_file.filename
        save_path = os.path.join(pr_path if cdmtype == 'PR' else wv_path, filename)
        uploaded_file.save(save_path)

        return jsonify({'message': 'Success', 'file_saved_to': save_path})

    except Exception as e:
        logging.exception("Upload failed")
        return jsonify({'message': 'False', 'error': 'Server error'}), 500
