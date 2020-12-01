FROM node:10.23.0-alpine3.10

WORKDIR /app
ENV PORT 80
RUN npm install
RUN npm run build
CMD ["npm", "start"]
COPY . .
