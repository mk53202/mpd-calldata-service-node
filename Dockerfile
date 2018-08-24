FROM alpine:3.4
LABEL authors="Matt Koster <mattkoster@gmail.com>"
RUN apk add --update nodejs bash
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
