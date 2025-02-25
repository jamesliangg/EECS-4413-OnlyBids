FROM mysql:8.0

# Change later
ENV MYSQL_ROOT_PASSWORD=root_password
ENV MYSQL_DATABASE=onlybids_database
ENV MYSQL_USER=mysql_user
ENV MYSQL_PASSWORD=mysql_user_password

# https://hub.docker.com/_/mysql
COPY ./init.sql /docker-entrypoint-initdb.d/ 