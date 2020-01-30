FROM node:11.8-alpine

ENV TOPICO=meu-topico
ENV HOST=0.0.0.0
ENV PORTA=9092
ENV SLACK=inserir-webhook
ENV CANAL=lab-consumidor
#exemplo: ENV CANAL=lab-testes

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install -g --silent
COPY . .

CMD [ "npm", "start" ]
