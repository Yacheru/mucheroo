FROM node:alpine

WORKDIR /app

COPY package*.json ./
COPY ecosystem.config.js .
COPY . .

RUN npm install
RUN npm install pm2 -g

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]