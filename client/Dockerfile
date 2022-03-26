FROM node:16.14.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ ./

EXPOSE 3050

CMD ["npm", "run", "dev"]