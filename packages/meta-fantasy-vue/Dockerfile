FROM node:latest

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN yarn

EXPOSE 8081

CMD [ "yarn", "dev:serve" ]