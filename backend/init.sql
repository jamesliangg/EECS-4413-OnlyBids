-- Create the users table
-- https://www.w3schools.com/sql/sql_create_table.asp
CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    security_question VARCHAR(255) NOT NULL,
    security_answer VARCHAR(255) NOT NULL,
    street VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Item (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    starting_price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE Auction (
    auction_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT UNIQUE NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('ongoing', 'completed', 'canceled') DEFAULT 'ongoing',
    type ENUM('forward', 'dutch') DEFAULT 'forward',
    payment_status ENUM('pending', 'completed') DEFAULT 'pending',
    winner_id INT NULL,
    final_price DECIMAL(10,2) NULL,
    shipping_price DECIMAL(10,2) DEFAULT 8.00,
    expedited_price DECIMAL(10,2) DEFAULT 10.00,
    FOREIGN KEY (item_id) REFERENCES Item(item_id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES User(user_id) ON DELETE SET NULL
);

CREATE TABLE Watchlist (
    watchlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    auction_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (auction_id) REFERENCES Auction(auction_id) ON DELETE CASCADE
);

CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    auction_id INT NOT NULL,
    buyer_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auction_id) REFERENCES Auction(auction_id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Grant permissions to mysql_user
-- Was getting access denied error
GRANT ALL PRIVILEGES ON onlybids_database.* TO 'mysql_user'@'%';
FLUSH PRIVILEGES;
