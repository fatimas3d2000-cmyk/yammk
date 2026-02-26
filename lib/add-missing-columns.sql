-- Add missing columns to patients table if they don't exist

-- Add password column (if not exists)
ALTER TABLE patients 
ADD COLUMN password TEXT;

-- Add is_active column
ALTER TABLE patients 
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Add user_type column
ALTER TABLE patients 
ADD COLUMN user_type TEXT DEFAULT 'patient';

-- Add profile_picture column
ALTER TABLE patients 
ADD COLUMN profile_picture TEXT;

-- Add bio column
ALTER TABLE patients 
ADD COLUMN bio TEXT;

-- Add specialization column (for providers)
ALTER TABLE patients 
ADD COLUMN specialization TEXT;

-- Add experience column (for providers)  
ALTER TABLE patients 
ADD COLUMN experience INTEGER;

-- Add rating column
ALTER TABLE patients 
ADD COLUMN rating DECIMAL(3, 2);

-- Rename 'name' to 'full_name' if it exists
-- (First create full_name, copy data, then drop name)
ALTER TABLE patients 
ADD COLUMN full_name TEXT;

UPDATE patients SET full_name = name WHERE full_name IS NULL AND name IS NOT NULL;

-- If you want to drop the 'name' column:
-- ALTER TABLE patients DROP COLUMN name;
