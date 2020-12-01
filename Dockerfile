FROM node:10.23.0-alpine3.10

WORKDIR /app
COPY . .
RUN npm install
RUN npm start
