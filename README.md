# eSteem Search

Make sure you have redis and python 3 installed, configured on hosting machine

# Redis

## Mac

`brew install redis`

start redis

`brew services restart redis`

## Ubuntu

```
sudo apt update
sudo apt install redis-server
```
start redis

`sudo systemctl reload redis.service`

# Config.ini

rename `config.ini.example` to `config.ini` and change parameters

# Build webapp

```
cd react_app/
npm install
npm run build
```

# Setup

`pip3 install -r requirements.txt`

To start webserver run 

`python3 app.py`

