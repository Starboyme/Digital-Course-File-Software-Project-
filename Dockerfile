FROM node:16
WORKDIR /api
COPY package.json /api
RUN npm install
RUN apt-get update && apt-get install -y mongodb
COPY . /api
CMD ["npm","start"]
EXPOSE 3000