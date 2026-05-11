FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

# Run unit tests
RUN npm test

EXPOSE 5000
CMD ["npm", "start"]
