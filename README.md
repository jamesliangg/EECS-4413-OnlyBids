# EECS-4413-OnlyBids
See `README.md` in folders for directions on how to run backend and frontend

# Folder Structure
```
├── backend/                    # All the Express and Node backend stuff
├── frontend/                   # React frontend
├── test-client/                # Test HTML for websockets
├── .gitignore                  # Ignore node_modules and the such
└── README.md                   # This file :D
```

# Getting Started
## .env file
Create a `.env` in the `root` folder with the following keys
```
DB_HOST=mysql_db
DB_USER=mysql_user
DB_PASSWORD=mysql_user_password
DB_NAME=onlybids_database
PORT=3000
MYSQL_ROOT_PASSWORD=root_password
```

## Build and start the containers (Vite, MySQL and Node.js)
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



