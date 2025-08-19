/*
  Warnings:

  - You are about to drop the column `photo` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospital_id` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('DOCTOR', 'PATIENT', 'HOSPITAL');

-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('LAB_REPORT', 'PRESCRIPTION', 'DOCTOR_NOTES', 'MEDICAL_HISTORY', 'MEDICAL_EXPENSES', 'VACCINATION');

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "hospital_id" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Patient" DROP COLUMN "photo";

-- CreateTable
CREATE TABLE "public"."documents" (
    "did" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "user_type" "public"."UserType" NOT NULL,
    "document_type" "public"."DocumentType" NOT NULL,
    "document_name" TEXT NOT NULL,
    "document_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("did")
);

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "public"."Hospital"("custom_hospital_id") ON DELETE RESTRICT ON UPDATE CASCADE;
