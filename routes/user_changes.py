import re
from flask import Blueprint, request, jsonify, session
from custom_functions.database.user_db import change_password, change_api_key

user_change_bp = Blueprint('user_change_bp', __name__)

# Define allowed characters regex (no spaces allowed)
PASSWORD_REGEX = re.compile(r'^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};\'":\\|,.<>\/?`~]+$')

@user_change_bp.route('/user/change_password', methods=['POST'])
def change_password_route():
    username = session.get('username')
    if not username:
        return jsonify({'message': 'False'}), 400

    try:
        data = request.get_json()
        new_password = data.get('new_password', '')

        if not PASSWORD_REGEX.match(new_password):
            return jsonify({'message': 'Invalid password format'}), 400

        change_password(username=username, new_password=new_password)
        return jsonify({'message': 'True'}), 200

    except Exception as e:
        return jsonify({'message': 'False'}), 400


@user_change_bp.route('/user/change_api_key', methods=['POST'])
def change_api_key_route():
    # Ensure the user is logged in by checking session for 'username'
    username = session.get('username')
    if not username:
        return jsonify({'message': 'False', 'error': 'User not logged in'}), 400

    # Get the new API key from the request body
    new_api_key = request.json.get('new_api_key')

    if not new_api_key:
        return jsonify({'message': 'False', 'error': 'New API key not provided'}), 400

    try:
        # Call the function to update the API key in the database
        success = change_api_key(username=username, new_api_key=new_api_key)

        if success:
            return jsonify({'message': 'True', 'success': 'API key changed successfully'}), 200
        else:
            return jsonify({'message': 'False', 'error': 'Failed to change API key'}), 500

    except Exception as e:
        # Catch any unexpected errors and return a response
        return jsonify({'message': 'False', 'error': str(e)}), 500