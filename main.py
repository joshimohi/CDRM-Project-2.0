from custom_functions.prechecks.python_checks import run_python_checks
run_python_checks()
from custom_functions.prechecks.precheck import run_precheck
run_precheck()
from flask import Flask
from flask_cors import CORS
from routes.react import react_bp
from routes.api import api_bp
from routes.remote_device_wv import remotecdm_wv_bp
from routes.remote_device_pr import remotecdm_pr_bp
from routes.upload import upload_bp
from routes.user_info import user_info_bp
from routes.register import register_bp
from routes.login import login_bp
import os
import yaml
app = Flask(__name__)
with open(f'{os.getcwd()}/configs/config.yaml', 'r') as file:
    config = yaml.safe_load(file)
app.secret_key = config['secret_key_flask']

CORS(app)

# Register the blueprint
app.register_blueprint(react_bp)
app.register_blueprint(api_bp)
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)
app.register_blueprint(user_info_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(remotecdm_wv_bp)
app.register_blueprint(remotecdm_pr_bp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')