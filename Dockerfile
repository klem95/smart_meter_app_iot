# Getting base image
FROM node:10-slim


# This informs the system which dir all further actions takes place in
WORKDIR /usr/app

RUN apt-get update &&  \
        apt-get -y install python build-essential nodejs

# Copies the local files into the image
COPY package.json .
RUN npm install

# Copy everything from the local folder into the image
COPY . .


