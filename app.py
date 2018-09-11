import os
from flask import Flask, send_from_directory
from flask_wtf.csrf import CsrfProtect

app = Flask(__name__, static_folder='react_app/build')
csrf = CsrfProtect()

csrf.init_app(app)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("react_app/build/" + path):
        return send_from_directory('react_app/build', path)
    else:
        return send_from_directory('react_app/build', 'index.html')


if __name__ == '__main__':
    app.run(use_reloader=True, port=3002, threaded=True)
