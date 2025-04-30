from flask import Blueprint, request, jsonify
from custom_functions.database.user_db import add_user

register_bp = Blueprint(
    'register_bp',
    __name__,
)

@register_bp.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        for required_field in ['username', 'password']:
            if required_field not in data:
                return jsonify({
                    'error': f'Missing required field: {required_field}'
                })
        if add_user(data['username'], data['password']):
            return jsonify({
                'message': 'User successfully registered!'
            })
        else:
            return jsonify({
                'error': 'User already exists!'
            })
    else:
        return jsonify({
            'error': 'Method not supported'
        })