-- Enable event scheduler
SET GLOBAL event_scheduler = ON;

-- Create event to update auction status
CREATE EVENT update_auction_status
ON SCHEDULE EVERY 1 MINUTE
DO
  UPDATE Auction 
  SET status = 'completed' 
  WHERE end_time <= UTC_TIMESTAMP() AND status = 'ongoing';