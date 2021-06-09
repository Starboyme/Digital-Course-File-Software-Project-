# FROM node:16
# WORKDIR /api
# COPY package.json /api
# RUN npm install
# # RUN apt-get install gnupg && wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list && apt-get update && apt-get install -y mongodb-org
# COPY . /api
# CMD ["npm","start"]
# EXPOSE 3000
FROM node:latest
RUN mkdir -p /app/src
WORKDIR /app/src
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]