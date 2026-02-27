PRAGMA foreign_keys=off;
BEGIN TRANSACTION;

-- Add cep column to students table
ALTER TABLE students ADD COLUMN cep TEXT;

COMMIT;
PRAGMA foreign_keys=on;
