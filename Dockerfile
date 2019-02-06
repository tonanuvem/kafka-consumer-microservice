FROM node:11.8-alpine

ENV TOPICO=meu-topico
ENV HOST=0.0.0.0
ENV PORTA=9092

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
