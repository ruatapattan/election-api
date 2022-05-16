# syntax=docker/dockerfile:1

FROM node:16.14.0


WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm ci

COPY . .

RUN npm test

EXPOSE 3000

CMD ["npm", "start"]