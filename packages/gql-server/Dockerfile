FROM node:latest

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN mkdir -p /gql-server
WORKDIR /gql-server

COPY . /gql-server

RUN yarn

EXPOSE 4000

CMD [ "yarn", "start" ]