FROM node:10.14.2-alpine
WORKDIR /usr/src/api
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production --silent
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
