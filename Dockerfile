FROM node:22.9-alpine3.20

ARG WEBHOOK_ARG=inserir_webhook

ENV TOPICO=meu-topico
ENV HOST=0.0.0.0
ENV PORTA=9092
ENV WEBHOOK=$WEBHOOK_ARG
ENV CANAL=lab-consumidor
#ENV CANAL=lab-testes

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install -g --silent
COPY . .

CMD [ "npm", "start" ]
