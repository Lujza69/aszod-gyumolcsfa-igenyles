
-- Safely increase stock without touching existing applications
-- +20 for each fruit
UPDATE inventory 
SET remaining = remaining + 20 
WHERE id IN ('barack', 'szilva', 'korte');

-- +50 for bulbs
UPDATE inventory 
SET remaining = remaining + 50 
WHERE id = 'hagyma';
