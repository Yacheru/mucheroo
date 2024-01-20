FROM node:alpine

WORKDIR /app

COPY package*.json ./
COPY ecosystem.config.js .

RUN npm install
RUN npm install pm2 -g

COPY . .

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]