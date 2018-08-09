FROM alpine:3.4

# File Author / Maintainer
LABEL authors="Matt Koster <mattkoster@gmail.com>"

# Update & install required packages
RUN apk add --update nodejs bash git

# Install app dependencies
COPY package.json /www/package.json
RUN cd /www; npm install

# Copy app source
COPY . /www

# Set work directory to /www
WORKDIR /www

# set port
#ENV PORT 7300

# expose the port to outside
#EXPOSE  7300

# start command as per package.json
CMD ["npm", "start"]
