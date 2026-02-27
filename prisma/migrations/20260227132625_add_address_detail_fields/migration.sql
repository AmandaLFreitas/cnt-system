/*
  Warnings:

  - You are about to alter the column `birth_date` on the `students` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `completion_date` on the `students` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `is_completed` on the `students` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "cpf" TEXT,
    "guardian" TEXT,
    "father_name" TEXT,
    "mother_name" TEXT,
    "phone" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "course_id" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "cep" TEXT,
    "street" TEXT,
    "number" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completion_date" DATETIME,
    CONSTRAINT "students_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_students" ("address", "birth_date", "completion_date", "course_id", "cpf", "email", "father_name", "full_name", "guardian", "id", "is_completed", "mother_name", "phone") SELECT "address", "birth_date", "completion_date", "course_id", "cpf", "email", "father_name", "full_name", "guardian", "id", "is_completed", "mother_name", "phone" FROM "students";
DROP TABLE "students";
ALTER TABLE "new_students" RENAME TO "students";
CREATE UNIQUE INDEX "students_cpf_key" ON "students"("cpf");
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
CREATE INDEX "students_course_id_idx" ON "students"("course_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
