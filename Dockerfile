FROM node:8

ADD . /code
WORKDIR /code

npm install no-kafka

CMD [ "npm", "start" ]
