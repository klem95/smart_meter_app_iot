# Getting base image
FROM node:10 

# This informs the system which dir all further actions takes place in
WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN apt-get update 

EXPOSE 5000

CMD [ "npm", "start" ] 

# Copy the rest of your app's source code from your host to your image filesystem.


