FROM node:boron

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/deploy

WORKDIR /usr/src/app

ADD package.json /usr/src/app/package.json

RUN npm install

RUN npm i -g serve

ADD . /usr/src/app

RUN npm run build

RUN cp -r /usr/src/app/build /usr/src

WORKDIR /usr/src/build

CMD serve -p 80 -s
