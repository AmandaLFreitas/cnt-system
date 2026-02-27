PRAGMA foreign_keys=off;
BEGIN TRANSACTION;

-- Create new temporary table with `address` column (replacing `adress`)
CREATE TABLE "_new_students" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "full_name" TEXT NOT NULL,
    "cpf" TEXT,
    "guardian" TEXT,
    "father_name" TEXT,
    "mother_name" TEXT,
    "phone" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "is_completed" INTEGER NOT NULL DEFAULT 0,
    "completion_date" TEXT,
    FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE
);

-- Copy data from old table, mapping `adress` -> `address`
INSERT INTO "_new_students" (
  id, full_name, cpf, guardian, father_name, mother_name, phone, birth_date, course_id, email, address, is_completed, completion_date
) SELECT
  id, full_name, cpf, guardian, father_name, mother_name, phone, birth_date, course_id, email, adress, is_completed, completion_date
FROM students;

DROP TABLE students;
ALTER TABLE "_new_students" RENAME TO students;

COMMIT;
PRAGMA foreign_keys=on;
