/*
  Warnings:

  - You are about to drop the column `barcode` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `qrcode` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Patient" DROP COLUMN "barcode",
DROP COLUMN "qrcode";
