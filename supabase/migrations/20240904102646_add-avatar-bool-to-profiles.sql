--- Add a column to the profiles table to store if a user has an avatar or not
ALTER TABLE profiles
ADD COLUMN has_avatar BOOLEAN DEFAULT FALSE;
