FROM node:11.6.0

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . .

RUN yarn

EXPOSE 4000

CMD [ "yarn", "start" ]