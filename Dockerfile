FROM node:13.7-alpine3.10

ENV TOPICO=meu-topico
ENV HOST=0.0.0.0
ENV PORTA=9092
ENV SLACK=inserir-webhook
ENV CANAL=lab-consumidor
#ENV CANAL=lab-testes

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install -g --silent
COPY . .

CMD [ "npm", "start" ]
