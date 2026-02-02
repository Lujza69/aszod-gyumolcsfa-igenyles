
-- Truncate applications table (remove all data)
truncate table applications;

-- Reset inventory to initial values
update inventory set remaining = 50 where id in ('barack', 'szilva', 'korte');
update inventory set remaining = 210 where id = 'hagyma';
