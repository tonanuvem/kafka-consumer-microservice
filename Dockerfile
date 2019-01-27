FROM node:8

ADD . /code
WORKDIR /code

RUN npm install no-kafka
RUN npm install jquery
RUN npm install axios

CMD [ "npm", "start" ]
