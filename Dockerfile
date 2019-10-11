#Base image
FROM node:alpine

WORKDIR /usr/app

#Copy the dependencies file
COPY ./package.json ./

#Install packages
RUN npm install 

#Copy remaining files
COPY ./ ./

#Start the application
CMD ["npm","start"]
