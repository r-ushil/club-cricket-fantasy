FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install react-icons --save

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

