FROM mongo:latest
EXPOSE 27017
CMD ["mongod", "--bind_ip_all"]
