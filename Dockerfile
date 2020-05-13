FROM node:12-alpine

COPY package.json /
COPY *.js /
COPY .env /

RUN npm install

CMD node index.js