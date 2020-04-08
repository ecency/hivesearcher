import json
import os

import redis
import requests
from cachelib import RedisCache
from flask import Flask, send_from_directory
from flask import request, jsonify, abort
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from xonfig import get_option

REDIS_HOST = get_option('REDIS', 'HOST')
REDIS_PORT = get_option('REDIS', 'PORT')
REDIS_PASS = get_option('REDIS', 'PASS')

r = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASS, decode_responses=True)

API_URL = get_option('ESEARCH_API', 'URL')
API_TOKEN = get_option('ESEARCH_API', 'TOKEN')
API_REQUEST_TIMEOUT = get_option('ESEARCH_API', 'REQUEST_TIMEOUT')
API_CACHE_TIMEOUT = get_option('ESEARCH_API', 'CACHE_TIMEOUT')

app = None
cache = None


def __flask_setup():
    global app, cache

    app = Flask(__name__, static_folder='react_app/build', template_folder='react_app/build')
    app.wsgi_app = ProxyFix(app.wsgi_app)

    app.config['DEVELOPMENT'] = get_option('FLASK', 'DEVELOPMENT')
    app.config['DEBUG'] = get_option('FLASK', 'DEBUG')

    CORS(app, resources={r"/search-iframe*": {"origins": "*"}})

    cache = RedisCache(REDIS_HOST, REDIS_PORT, REDIS_PASS)


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
        sort = request.form.get('so')
        page = request.form.get('pa')

        if not query or not sort or not page:
            abort(400)

        # cache with small timeout in order to make less busy elastic search
        cache_key = '{}-{}-{}'.format(query, sort, page)
        rv = cache.get(cache_key)
        if rv is None:
            headers = {'Content-Type': 'application/json', 'Authorization': API_TOKEN}
            payload = {'q': query, 'sort': sort, 'page': page}

            resp = requests.post('{}/search-paged'.format(API_URL), data=json.dumps(payload), headers=headers,
                                 timeout=API_REQUEST_TIMEOUT)

            if resp.status_code != 200:
                abort(500)

            resp_data = resp.json()
            rv = json.dumps(resp_data)
            cache.set(cache_key, rv, timeout=API_CACHE_TIMEOUT)

        return app.response_class(response=rv, status=200, mimetype='application/json')

    @app.route('/api/count', methods=['GET'])
    def count():
        try:
            c = int(r.get('doc_count'))
        except TypeError:
            c = 0
        return jsonify(c)

    @app.route('/api/api-packages', methods=['GET'])
    def packages():
        resp = requests.get('{}/packages'.format(API_URL))

        return app.response_class(response=resp.content, status=200, mimetype='application/json')

    @app.route('/api/register-api-key', methods=['POST'])
    def register():

        user = request.json.get('u')
        token = request.json.get('t')
        package = request.json.get('p')

        # check steem connect token
        headers = {'Content-Type': 'application/json', 'authorization': token}
        sc_resp = requests.post('https://hivesigner.com/api/me', headers=headers)

        assert sc_resp.json()['user'] == user

        # create key
        headers = {'Content-Type': 'application/json'}
        resp = requests.post('{}/gen_key'.format(API_URL), data=json.dumps({'p': package, 'u': user}), headers=headers)

        return app.response_class(response=resp.content, status=200, mimetype='application/json')


__flask_setup()
__endpoint_setup()


def __run_dev_server():
    global app

    CORS(app, resources={r"*": {"origins": "*"}})

    app.run(host='127.0.0.1', port=3002)


def main():
    __run_dev_server()


if __name__ == '__main__':
    main()
