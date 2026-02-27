-- Add indexes for foreign key fields to improve query performance

PRAGMA foreign_keys=off;
BEGIN TRANSACTION;

CREATE INDEX "students_course_id_idx" ON "students"("course_id");
CREATE INDEX "attendance_records_student_id_idx" ON "attendance_records"("student_id");

COMMIT;
PRAGMA foreign_keys=on;
