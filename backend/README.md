https://expressjs.com/
https://hub.docker.com/_/mysql
# Getting Started
## .env file
Create a `.env` in the `backend` folder with the following keys
```
DB_HOST=mysql_db
DB_USER=mysql_user
DB_PASSWORD=mysql_user_password
DB_NAME=onlybids_database
PORT=3000
```

## Build and start the containers (MySQL and Node.js)
```shell
docker-compose up --build
```

## To stop the containers
```shell
docker-compose down
```

## To stop containers and delete volumes
```shell
docker-compose down -v
```

## To view logs
```shell
docker-compose logs
```

# Sample Data
## Generating Init Data
To generate password/security answer hashes, go to the `backend/generateHash.js` file and update the `password` variable.
Then run
```
node scripts/generateHash.js
```
Hashed password will be logged to console. You can then add it to the `seed.sql` file.

## Sample Email, Passwords, Security Answer
```
john@example.com:excellentPassword1:Atlantis
jane@example.com:excellentPassword2:Gotham
bob@example.com:excellentPassword3:Tatooine
alice@example.com:excellentPassword4:Neverland
charlie@example.com:excellentPassword5:Lassonde
```



# Folder Structure
TB completed

