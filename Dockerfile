FROM node:lts-alpine

WORKDIR /app
COPY . .
RUN npm install http-server -g
EXPOSE 80

CMD ["http-server", "-p", "80"]
