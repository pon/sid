FROM node:boron

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD docker_entrypoint /usr/bin/docker_entrypoint

ADD package.json  /usr/src/app/package.json

RUN npm install

ADD . /usr/src/app

CMD ["npm", "start"]
