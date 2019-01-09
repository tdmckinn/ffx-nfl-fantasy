FROM node:11.6.0

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN \
    apt-get update && \
    apt-get install -y git && \
    npm i lerna -g --loglevel notice 

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app


COPY package.json .
COPY yarn.lock .
COPY lerna.json .

COPY packages/gql-server ./packages/gql-server
COPY packages/meta-fantasy-vue ./packages/meta-fantasy-vue

# install and build
RUN yarn

RUN lerna bootstrap
   
CMD [ "yarn", "start" ]