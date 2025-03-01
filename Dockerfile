FROM ubuntu:latest

RUN apt-get update && apt-get install -y mongodb

EXPOSE 27017

CMD ["mongod", "--bind_ip_all"]