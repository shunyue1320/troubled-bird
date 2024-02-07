FROM node:lts-alpine

WORKDIR /app
COPY . .
EXPOSE 80

CMD ["npx", "http-server", "-p", "80"]
