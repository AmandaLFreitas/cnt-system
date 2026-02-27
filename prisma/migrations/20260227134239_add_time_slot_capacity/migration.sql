-- CreateTable
CREATE TABLE "time_slot_capacities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slot_id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "total_vacancies" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "time_slot_capacities_day_idx" ON "time_slot_capacities"("day");

-- CreateIndex
CREATE UNIQUE INDEX "time_slot_capacities_slot_id_key" ON "time_slot_capacities"("slot_id");
