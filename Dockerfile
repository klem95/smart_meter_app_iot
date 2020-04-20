# Getting base image
FROM node:latest

# This informs the system which dir all further actions takes place in
WORKDIR /usr/app

# Copies the local files into the image
COPY package.json .
RUN npm install

# Copy everything from the local folder into the image
COPY . .


