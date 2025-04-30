import sys
import os
from flask import Blueprint, send_from_directory, request, render_template
from configs import index_tags

if getattr(sys, 'frozen', False):  # Running as a bundled app
    base_path = sys._MEIPASS
else:  # Running in a normal Python environment
    base_path = os.path.abspath(".")

static_folder = os.path.join(base_path, 'cdrm-frontend', 'dist')

react_bp = Blueprint(
    'react_bp',
    __name__,
    static_folder=static_folder,
    static_url_path='/',
    template_folder=static_folder
)

@react_bp.route('/', methods=['GET'])
@react_bp.route('/<path:path>', methods=["GET"])
@react_bp.route('/<path>', methods=["GET"])
def index(path=''):
    if request.method == 'GET':
        file_path = os.path.join(react_bp.static_folder, path)
        if path != "" and os.path.exists(file_path):
            return send_from_directory(react_bp.static_folder, path)
        elif path.lower() in ['', 'cache', 'api', 'testplayer', 'account']:
            data = index_tags.tags.get(path.lower(), index_tags.tags['index'])
            return render_template('index.html', data=data)
        else:
            return send_from_directory(react_bp.static_folder, 'index.html')
