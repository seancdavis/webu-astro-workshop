-- Step 1: Add the user_id column to the reviews table
ALTER TABLE reviews
ADD COLUMN user_id uuid not null;
-- Step 2: Add a foreign key constraint to the user_id column
ALTER TABLE reviews
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES profiles(id);
