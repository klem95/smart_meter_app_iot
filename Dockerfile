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

EXPOSE 8080

# Runs when applied to a container
CMD [ "node", "src/app.ts" ] 