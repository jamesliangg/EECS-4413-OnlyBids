-- Reset all existing data
-- Disable integrity checks to truncate tables
SET FOREIGN_KEY_CHECKS = 0;
-- Truncate tables
-- https://www.w3schools.com/sql/sql_ref_drop_table.asp
TRUNCATE TABLE Payment;
TRUNCATE TABLE Auction;
TRUNCATE TABLE Item;
TRUNCATE TABLE User;
-- Re-enable integrity checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert sample users
-- https://www.mockaroo.com/
INSERT INTO User (username, email, password_hash, security_question, security_answer, street, city, state, postal_code, country) VALUES
('john_doe', 'john@example.com', '$2b$10$0f2klm.jZUWGKSbyxZrUZ.L5KdVz6s1fho7PAxyO5VuZgHVpiH7zC', 'In what city did your parents meet?', '$2b$10$EponL4ew/Zz6DecM7euxYOOPc01gZSZdILM95IkcfAt/9GH7EoCGm', '1 Stone Corner Court', 'Toronto', 'Ontario', 'M5V 2T6', 'Canada'),
('jane_smith', 'jane@example.com', '$2b$10$7tAEVR2oOCo8PeEncVZ1sOmTsB3BJi566Wfhav46Q5mREpDTJhJ32', 'In what city did your parents meet?', '$2b$10$8NjIyZX5lTsgPfRKhoEbweur90bA3IRtbxETjzhZPDATA43d71z1K', '69 Graedel Parkway', 'Vancouver', 'British Columbia', 'V6B 3K9', 'Canada'),
('bob_wilson', 'bob@example.com', '$2b$10$9smdHjBe4fJfx5jieX3OTeTPLceTFUbs1EZL1CZ702j72Whg1i782', 'In what city did your parents meet?', '$2b$10$gJFUc6YFHvGz0aBzvYv.veK1Y08iBtn1H.l.kGR7SvMGyW4kOmUaC', '2 Doe Crossing Circle', 'Montreal', 'Quebec', 'H3B 2Y5', 'Canada'),
('alice_brown', 'alice@example.com', '$2b$10$e9GxROq90mUjsDqaRX7P2uSdGjx4spvhPdYucWYB/CIxv.nxVD7qm', 'In what city did your parents meet?', '$2b$10$M9kcw90O3lvkNhmTUPXX5enDZYM9UcJESgZvV3JmRWiyRJkuoQQli', '926 Harbort Plaza', 'Calgary', 'Alberta', 'T2P 4J8', 'Canada'),
('charlie_green', 'charlie@example.com', '$2b$10$/t465p8340HhaT8hSZrXq.0ioJ6f37XcTsoKV.uoML.Bp4s9osULe', 'In what city did your parents meet?', '$2b$10$MsCuHXB337OtDl6Er06NUOBl0zC0AFtiUm0NsPN5QSDTxu1Crsc5C', '3 Atwood Parkway', 'Ottawa', 'Ontario', 'K1P 5G3', 'Canada');

-- Insert items for auctions
INSERT INTO Item (seller_id, name, description, starting_price, image_url) VALUES
(1, 'Vintage Watch', 'A beautiful watch from the 1950s', 199.99, 'https://example.com/watch.jpg'),
(2, 'Gaming Console', 'Lastest console from Xony, barely used', 299.99, 'https://example.com/console.jpg'),
(3, 'YorkU Lmap', 'Lamp with YorkU logo', 200.99, 'https://example.com/lamp.jpg'),
(4, 'Rare Comic Book', 'First edition, mint condition', 20.99, 'https://example.com/comic.jpg'),
(5, 'Antique Vase', 'Heirloom vase from the 1800s', 90.99, 'https://example.com/vase.jpg');

-- Insert auctions (3 forward, 2 dutch)
-- Using variables to set end time 3 hours from now
SET @end_time = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 3 HOUR);

-- Forward Auctions
INSERT INTO Auction (item_id, start_time, end_time, status, type) VALUES
(1, UTC_TIMESTAMP(), @end_time, 'ongoing', 'forward'),
(2, UTC_TIMESTAMP(), @end_time, 'ongoing', 'forward'),
(3, UTC_TIMESTAMP(), @end_time, 'ongoing', 'forward');

-- Dutch Auctions
INSERT INTO Auction (item_id, start_time, end_time, status, type) VALUES
(4, UTC_TIMESTAMP(), @end_time, 'ongoing', 'dutch'),
(5, UTC_TIMESTAMP(), @end_time, 'ongoing', 'dutch'); 