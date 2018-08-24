FROM alpine:3.8
LABEL authors="Matt Koster <mattkoster@gmail.com>"
RUN apk add --update nodejs npm bash
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
