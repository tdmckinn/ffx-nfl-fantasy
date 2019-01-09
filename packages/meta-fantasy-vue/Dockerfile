FROM node:11.6.0

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN yarn

EXPOSE 8081

CMD [ "yarn", "dev:serve" ]