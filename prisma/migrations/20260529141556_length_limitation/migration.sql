/*
  Warnings:

  - You are about to alter the column `name` on the `units` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `performer_name` on the `work_log_entries` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `work_types` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "units" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "work_log_entries" ALTER COLUMN "performer_name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "work_types" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);
