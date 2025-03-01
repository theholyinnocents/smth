FROM ubuntu:latest

# Устанавливаем MongoDB
RUN apt-get update && apt-get install -y gnupg curl && \
    curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list && \
    apt-get update && apt-get install -y mongodb-org

# Открываем порт MongoDB
EXPOSE 27017

# Запускаем MongoDB
CMD ["mongod", "--bind_ip_all"]