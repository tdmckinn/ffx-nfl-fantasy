FROM node:11.6.0

WORKDIR /usr/app

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

COPY . /usr/app

RUN yarn

EXPOSE 4000

CMD [ "yarn", "start" ]