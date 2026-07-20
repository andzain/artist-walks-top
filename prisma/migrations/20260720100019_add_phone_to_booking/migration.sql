/*
  Warnings:

  - Added the required column `phone` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "phone" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Booking" ALTER COLUMN "phone" DROP DEFAULT;
