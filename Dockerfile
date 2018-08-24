FROM node:8

LABEL authors="Matt Koster <mattkoster@gmail.com>"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
