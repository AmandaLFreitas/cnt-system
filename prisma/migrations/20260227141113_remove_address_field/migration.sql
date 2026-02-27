/*
  Warnings:

  - You are about to drop the column `address` on the `students` table. All the data in the column will be lost.

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
INSERT INTO "new_students" ("birth_date", "cep", "city", "completion_date", "course_id", "cpf", "email", "father_name", "full_name", "guardian", "id", "is_completed", "mother_name", "neighborhood", "number", "phone", "state", "street") SELECT "birth_date", "cep", "city", "completion_date", "course_id", "cpf", "email", "father_name", "full_name", "guardian", "id", "is_completed", "mother_name", "neighborhood", "number", "phone", "state", "street" FROM "students";
DROP TABLE "students";
ALTER TABLE "new_students" RENAME TO "students";
CREATE UNIQUE INDEX "students_cpf_key" ON "students"("cpf");
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
CREATE INDEX "students_course_id_idx" ON "students"("course_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
