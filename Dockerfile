FROM node:8

ADD . /code
WORKDIR /code

RUN npm install no-kafka

CMD [ "npm", "start" ]
