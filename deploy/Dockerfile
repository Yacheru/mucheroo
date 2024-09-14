FROM node:alpine

WORKDIR /mucheroo

COPY .. /mucheroo

RUN npm install
RUN npm install pm2 -g

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
