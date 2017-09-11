FROM nginx
COPY build /usr/share/nginx/html

FROM node:boron
COPY build /usr/src/app

WORKDIR /usr/src/app

RUN npm i -g serve

CMD serve -p 80 -s
