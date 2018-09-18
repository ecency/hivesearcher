import os
from flask import Flask, send_from_directory, render_template
from werkzeug.contrib.fixers import ProxyFix
from xonfig import get_option
import requests
from flask import request, jsonify, abort
import json
from flask_cors import CORS
import redis

REDIS_HOST = get_option('REDIS', 'HOST')
REDIS_PORT = get_option('REDIS', 'PORT')
REDIS_PASS = get_option('REDIS', 'PASS')

r = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASS, decode_responses=True)

API_URL = get_option('ESEARCH_API', 'URL')
API_TOKEN = get_option('ESEARCH_API', 'TOKEN')

app = None


def __flask_setup():
    global app

    app = Flask(__name__, static_folder='react_app/build', template_folder='react_app/build')
    app.wsgi_app = ProxyFix(app.wsgi_app)

    app.config['DEVELOPMENT'] = get_option('FLASK', 'DEVELOPMENT')
    app.config['DEBUG'] = get_option('FLASK', 'DEBUG')

    CORS(app)


def __endpoint_setup():
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists("react_app/build/" + path):
            return send_from_directory('react_app/build', path)
        else:
            return render_template('index.html')

    @app.route('/api/search', methods=['POST', 'OPTIONS'])
    def search():
        query = request.form.get('q')
        sort = request.form.get('so')
        page = request.form.get('pa')

        if not query or not sort or not page:
            abort(400)

        headers = {'Content-Type': 'application/json', 'Authorization': API_TOKEN}
        payload = {'q': query, 'sort': sort, 'page': page}

        resp = requests.post('{}/search-paged'.format(API_URL), data=json.dumps(payload), headers=headers, timeout=6)

        if resp.status_code != 200:
            abort(500)

        resp_data = resp.json()

        return json.dumps(resp_data)

    @app.route('/api/count', methods=['GET'])
    def count():
        c = int(r.get('doc_count'))
        return jsonify(c)


__flask_setup()
__endpoint_setup()


def __run_dev_server():
    global app

    app.run(host='127.0.0.1', port=3002)


def main():
    __run_dev_server()


if __name__ == '__main__':
    main()
