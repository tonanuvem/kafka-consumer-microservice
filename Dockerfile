FROM node:11.8-alpine

ADD . /code
WORKDIR /code

RUN npm install no-kafka
RUN npm install jquery
RUN npm install axios

CMD [ "npm", "start" ]
