FROM alpine:3.4

# File Author / Maintainer
LABEL authors="Matt Koster <mattkoster@gmail.com>"

# Update & install required packages
RUN apk add --update nodejs bash git

# Install app dependencies
COPY package.json /www/package.json
RUN cd /www; npm install
RUN cd /www; node db-create.js

# Copy app source
COPY . /www

# Set work directory to /www
WORKDIR /www

# start command as per package.json
CMD ["npm", "start"]
