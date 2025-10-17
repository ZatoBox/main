FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache tor curl

COPY package.json .
RUN npm install --production

COPY src ./src

EXPOSE 3001

CMD ["node", "src/index.js"]
