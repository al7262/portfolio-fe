
FROM nginx:stable
MAINTAINER Azzahra Lamuri  "zahra@alterra.id"

RUN mkdir -p /alterra/www/ancient.my.id
RUN mkdir -p /alterra/logs/nginx

COPY default.conf /etc/nginx/conf.d/
COPY . /alterra/www/ancient.my.id

WORKDIR /alterra/www/ancient.my.id