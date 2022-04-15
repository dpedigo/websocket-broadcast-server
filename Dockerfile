FROM node:17.9.0-alpine

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY package*.json .
RUN npm install --production

COPY src/ .

EXPOSE ${PORT}
CMD [ "node", "app.js" ]