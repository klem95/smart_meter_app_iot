# Getting base image
FROM node:10 

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install
RUN apt-get update 

CMD [ "echo", "yo dawg" ]

# Bundle app source
COPY . .

