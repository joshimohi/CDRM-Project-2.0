import re
from flask import Blueprint, request, jsonify
from custom_functions.database.user_db import add_user
import uuid

register_bp = Blueprint('register_bp', __name__)

USERNAME_REGEX = re.compile(r'^[A-Za-z0-9_-]+$')
PASSWORD_REGEX = re.compile(r'^\S+$')

@register_bp.route('/register', methods=['POST'])
def register():
    if request.method != 'POST':
        return jsonify({'error': 'Method not supported'}), 405

    data = request.get_json()

    # Check required fields
    for required_field in ['username', 'password']:
        if required_field not in data:
            return jsonify({'error': f'Missing required field: {required_field}'}), 400

    username = data['username']
    password = data['password']
    api_key = str(uuid.uuid4())

    # Validate username and password
    if not USERNAME_REGEX.fullmatch(username):
        return jsonify({
            'error': 'Invalid username. Only letters, numbers, hyphens, and underscores are allowed.'
        }), 400

    if not PASSWORD_REGEX.fullmatch(password):
        return jsonify({
            'error': 'Invalid password. Spaces are not allowed.'
        }), 400

    # Attempt to add user
    if add_user(username, password, api_key):
        return jsonify({'message': 'User successfully registered!'}), 201
    else:
        return jsonify({'error': 'User already exists!'}), 409
