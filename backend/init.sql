-- Create the users table
-- https://www.w3schools.com/sql/sql_create_table.asp
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant permissions to mysql_user
-- Was getting access denied error
GRANT ALL PRIVILEGES ON onlybids_database.* TO 'mysql_user'@'%';
FLUSH PRIVILEGES;