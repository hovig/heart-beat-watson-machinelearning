FROM node:latest
MAINTAINER Hovig Ohannessian <hovigg@hotmail.com>
WORKDIR /app
ADD . /app
RUN  npm install
EXPOSE 3000
RUN npm start
