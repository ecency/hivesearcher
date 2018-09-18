FROM node:8

RUN apt-get update
RUN apt-get install -y python3-pip

RUN pip3 install --upgrade pip

ENV APP_DIR /deploy

RUN mkdir -p ${APP_DIR}

COPY . ${APP_DIR}

WORKDIR ${APP_DIR}

RUN pip3 install -r ${APP_DIR}/requirements.txt

WORKDIR ${APP_DIR}/react_app

RUN npm rebuild node-sass

RUN npm install

RUN npm run build

WORKDIR ${APP_DIR}

EXPOSE 5001

CMD ["gunicorn",  "app:app", "-b", "127.0.0.1:5001"]

