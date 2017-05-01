FROM node:boron

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD docker_entrypoint /usr/bin/docker_entrypoint

ENTRYPOINT ["/usr/bin/docker_entrypoint"]
CMD ["npm", "start"]
