FROM node:10.23.0-alpine3.10

WORKDIR /app
ENV HOST 0.0.0.0
ENV PORT 80
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
COPY . .
