/*
  Warnings:

  - Added the required column `quiz` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `point` ADD COLUMN `quiz` VARCHAR(191) NOT NULL;
