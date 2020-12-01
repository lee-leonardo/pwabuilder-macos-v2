FROM node:10.12.10-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm start
