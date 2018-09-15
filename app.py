import os
from flask import Flask, send_from_directory
from flask_wtf.csrf import CsrfProtect
from werkzeug.contrib.fixers import ProxyFix
from xonfig import get_option
import requests
from flask import request, jsonify, abort
import json
from flask_cors import CORS
import time
import redis

REDIS_HOST = get_option('REDIS', 'HOST')
REDIS_PORT = get_option('REDIS', 'PORT')
REDIS_PASS = get_option('REDIS', 'PASS')

r = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASS, decode_responses=True)

API_URL = get_option('ESEARCH_API', 'URL')
API_TOKEN = get_option('ESEARCH_API', 'TOKEN')
PAGE_SIZE = 10

app = None


def __flask_setup():
    global app

    app = Flask(__name__, static_folder='react_app/build')
    app.wsgi_app = ProxyFix(app.wsgi_app)

    app.config['DEVELOPMENT'] = get_option('FLASK', 'DEVELOPMENT')
    app.config['DEBUG'] = get_option('FLASK', 'DEBUG')

    CORS(app)

    if not app.config['DEVELOPMENT']:
        csrf = CsrfProtect()
        csrf.init_app(app)


def __endpoint_setup():
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists("react_app/build/" + path):
            return send_from_directory('react_app/build', path)
        else:
            return send_from_directory('react_app/build', 'index.html')

    @app.route('/api/search', methods=['POST', 'OPTIONS'])
    def search():
        query = request.form.get('q')
        sort = request.form.get('sort')

        if not query or not sort:
            abort(400)

        scroll_id = request.form.get('si')

        headers = {'Content-Type': 'application/json', 'Authorization': API_TOKEN}
        payload = {'q': query, 'sort': sort}

        if scroll_id:
            payload['scroll_id'] = scroll_id

        resp = requests.post('{}/search'.format(API_URL), data=json.dumps(payload), headers=headers, timeout=6)

        if resp.status_code != 200:
            abort(500)

        resp_data = resp.json()

        return json.dumps(resp_data)

    @app.route('/api/count', methods=['GET'])
    def count():
        c = int(r.get('doc_count'))
        return json.dumps(c)


__flask_setup()
__endpoint_setup()


def __run_dev_server():
    global app

    app.run(host='127.0.0.1', port=3002)


def main():
    __run_dev_server()


if __name__ == '__main__':
    main()
