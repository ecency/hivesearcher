import os
import requests
import redis
import time

os.sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../', '../')))

from xonfig import get_option

API_URL = get_option('ESEARCH_API', 'URL')
API_TOKEN = get_option('ESEARCH_API', 'TOKEN')

REDIS_HOST = get_option('REDIS', 'HOST')
REDIS_PORT = get_option('REDIS', 'PORT')
REDIS_PASS = get_option('REDIS', 'PASS')

r = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASS, decode_responses=True)

while True:
    headers = {'Content-Type': 'application/json', 'Authorization': API_TOKEN}
    resp = requests.get('{}/{}'.format(API_URL, 'stats'), headers=headers, timeout=10)
    doc_count = resp.json()['hits']
    assert type(doc_count) == int
    r.set('doc_count', doc_count)
    time.sleep(1)
