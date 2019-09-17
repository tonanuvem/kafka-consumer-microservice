FROM node:11.8-alpine

ENV TOPICO=meu-topico
ENV HOST=0.0.0.0
ENV PORTA=9092
ENV SLACK=https://hooks.slack.com/services/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
#ENV SLACK=https://hooks.slack.com/services/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
#ENV CANAL=lab-consumidor
ENV CANAL=lab-testes

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

#EXPOSE 8080

#ADD . /code
#WORKDIR /code
#RUN npm install no-kafka
#RUN npm install jquery
#RUN npm install axios

CMD [ "npm", "start" ]
