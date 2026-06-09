# Hivesearcher

Web front-end for Hivesearcher — the search UI, the API documentation
(`/api-docs`) and API-key registration (`/api-register`). A small Flask app
serves the built single-page app and proxies a few endpoints to the search API.

- **Frontend:** React 18 + Vite (in `react_app/`)
- **Backend:** Flask + gunicorn (`app.py`)
- **State:** Redis (caches search responses and holds the indexed document count)

## Configuration

The backend reads its settings from `config.ini` (or from environment
variables — see below). Copy the example and fill in your own values:

```bash
cp config.ini.example config.ini
```

| Section       | Key                          | Description                                    |
| ------------- | ---------------------------- | ---------------------------------------------- |
| `ESEARCH_API` | `URL`                        | Base URL of the search API                     |
| `ESEARCH_API` | `TOKEN`                      | API key for the search API                     |
| `ESEARCH_API` | `REQUEST_TIMEOUT`            | Upstream request timeout (seconds)             |
| `ESEARCH_API` | `CACHE_TIMEOUT`              | Redis cache TTL for search responses (seconds) |
| `REDIS`       | `HOST` / `PORT` / `PASS`     | Redis connection                               |
| `FLASK`       | `DEVELOPMENT` / `DEBUG`      | Flask flags                                    |

`config.ini` is gitignored — **never commit real credentials**.

### Environment variable overrides

Any option can be overridden with an env var named `__ENV__<SECTION>_<OPTION>`,
for example `__ENV__ESEARCH_API_TOKEN=...` or `__ENV__REDIS_HOST=...`. This is
useful for containers/CI where you'd rather not keep a config file on disk.

To **update config**, change `config.ini` (or the env vars) and restart the app.

## Local development

Backend (Flask dev server on port 3002) — needs Redis running locally:

```bash
pip3 install -r requirements.txt
python3 app.py
```

Frontend (Vite dev server with hot reload):

```bash
cd react_app
yarn install
yarn dev      # dev server
yarn build    # production build into react_app/build
yarn test     # unit tests
```

In production the Flask app serves the built `react_app/build` directory.

## Production (Docker)

The web image is built with the multi-stage `Dockerfile-web` (Node builds the
SPA, Python runs Flask/gunicorn on port 5001):

```bash
docker build -f Dockerfile-web -t hivesearcher-web .
```

Run it, mounting `config.ini` at `/deploy/config.ini` (keep secrets out of the
image) and giving it access to your Redis and search API:

```bash
docker run -d --name hivesearcher-web --restart always \
  -p 5001:5001 \
  -v "$PWD/config.ini:/deploy/config.ini:ro" \
  hivesearcher-web
```

- **Update config:** edit the mounted `config.ini` (or the `__ENV__*` vars) and
  restart the container.
- **Deploy new code:** rebuild the image and recreate the container. Because the
  config is mounted (not baked into the image), it is preserved across rebuilds.

### Document counter (optional)

`Dockerfile-counter` builds a small worker (`counter/main.py`) that periodically
writes the indexed document count to Redis (served by the `/api/count`
endpoint). It uses the same `config.ini` / env configuration:

```bash
docker build -f Dockerfile-counter -t hivesearcher-counter .
docker run -d --name hivesearcher-counter --restart always \
  -v "$PWD/config.ini:/deploy/config.ini:ro" \
  hivesearcher-counter
```
