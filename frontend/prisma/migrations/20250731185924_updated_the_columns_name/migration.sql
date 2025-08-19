/*
  Warnings:

  - The primary key for the `Doctor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `DID` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `createdOn` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedOn` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `bloodGroup` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `chronicIllness` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `createdOn` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `customPatientId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `mobileNumber` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `updatedOn` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[custom_doctor_Id]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[custom_patient_Id]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobile_number]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_by` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `custom_doctor_Id` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_on` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blood_group` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `custom_patient_Id` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile_number` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_on` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Patient_customPatientId_key";

-- DropIndex
DROP INDEX "public"."Patient_mobileNumber_key";

-- AlterTable
ALTER TABLE "public"."Doctor" DROP CONSTRAINT "Doctor_pkey",
DROP COLUMN "DID",
DROP COLUMN "createdBy",
DROP COLUMN "createdOn",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "updatedBy",
DROP COLUMN "updatedOn",
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "custom_doctor_Id" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT NOT NULL,
ADD COLUMN     "updated_on" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Patient" DROP COLUMN "bloodGroup",
DROP COLUMN "chronicIllness",
DROP COLUMN "createdAt",
DROP COLUMN "createdOn",
DROP COLUMN "customPatientId",
DROP COLUMN "dateOfBirth",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "mobileNumber",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedOn",
ADD COLUMN     "blood_group" "public"."BloodGroup" NOT NULL,
ADD COLUMN     "chronic_illness" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "custom_patient_Id" TEXT NOT NULL,
ADD COLUMN     "date_of_birth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "mobile_number" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_on" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_custom_doctor_Id_key" ON "public"."Doctor"("custom_doctor_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_custom_patient_Id_key" ON "public"."Patient"("custom_patient_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_mobile_number_key" ON "public"."Patient"("mobile_number");
