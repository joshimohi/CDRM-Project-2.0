from flask import Blueprint, request, jsonify, session
from custom_functions.database.user_db import verify_user

login_bp = Blueprint(
    'login_bp',
    __name__,
)

@login_bp.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        for required_field in ['username', 'password']:
            if required_field not in data:
                return jsonify({'error': f'Missing required field: {required_field}'}), 400

        if verify_user(data['username'], data['password']):
            session['username'] = data['username']  # Stored securely in a signed cookie
            return jsonify({'message': 'Successfully logged in!'})
        else:
            return jsonify({'error': 'Invalid username or password!'}), 401

@login_bp.route('/login/status', methods=['POST'])
def login_status():
    try:
        username = session.get('username')
        if username:
            return jsonify({'message': 'True'})
        else:
            return jsonify({'message': 'False'})
    except:
        return jsonify({'message': 'False'})

@login_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Successfully logged out!'})