PRAGMA foreign_keys=off;
BEGIN TRANSACTION;

-- Normalize birth_date to ISO 8601 (e.g. 1995-03-15T00:00:00Z)
-- 1) Convert numeric millisecond timestamps to ISO
UPDATE students
SET birth_date = strftime('%Y-%m-%dT%H:%M:%SZ', CAST(birth_date AS INTEGER) / 1000, 'unixepoch')
WHERE birth_date GLOB '[0-9]*';

-- 2) Convert 'YYYY-MM-DD HH:MM:SS' style to 'YYYY-MM-DDTHH:MM:SSZ'
UPDATE students
SET birth_date = replace(birth_date, ' ', 'T') || 'Z'
WHERE birth_date GLOB '????-??-?? *' AND instr(birth_date, 'T') = 0;

COMMIT;
PRAGMA foreign_keys=on;
