PRAGMA foreign_keys=off;
BEGIN TRANSACTION;

-- Convert numeric millisecond timestamps stored in `birth_date` to ISO datetime strings
-- This handles values like "795225600000" (ms since epoch) and converts them to SQLite datetime
UPDATE students
SET birth_date = datetime(CAST(birth_date AS INTEGER) / 1000, 'unixepoch')
WHERE (
  typeof(birth_date) = 'text' AND birth_date GLOB '[0-9]*'
) OR typeof(birth_date) = 'integer';

COMMIT;
PRAGMA foreign_keys=on;
