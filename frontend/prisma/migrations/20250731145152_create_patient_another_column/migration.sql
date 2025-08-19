/*
  Warnings:

  - Added the required column `qrcode` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "qrcode" TEXT NOT NULL;
