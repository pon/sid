FROM node:boron

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/deploy

WORKDIR /usr/src/app

ADD package.json /usr/src/app/package.json

RUN npm install

ADD . /usr/src/app

RUN npm run build

RUN cp -r /usr/src/app/build /usr/src

WORKDIR /usr/src/build

RUN npm i -g serve

CMD serve -p 80 -s

