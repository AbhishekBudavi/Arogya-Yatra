/*
  Warnings:

  - The values [A_Positive,A_Negative,B_Positive,B_Negative,AB_Positive,AB_Negative,O_Positive,O_Negative] on the enum `BloodGroup` will be removed. If these variants are still used in the database, this will fail.
  - The values [Male,Female,Other] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_on` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `custom_doctor_Id` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalId` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `opdTiming` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `updated_on` on the `Doctor` table. All the data in the column will be lost.
  - The primary key for the `Hospital` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `HID` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `created_on` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `custom_patient_Id` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `updated_on` on the `Patient` table. All the data in the column will be lost.
  - You are about to alter the column `pincode` on the `Patient` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - A unique constraint covering the columns `[custom_doctor_id]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[custom_hospital_id]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[admin_mobile_number]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[custom_patient_id]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `custom_doctor_id` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospital_id` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opd_timing` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_mobile_number` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_name` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `custom_hospital_id` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospital_name` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospital_type` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `custom_patient_id` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."HospitalType" AS ENUM ('PRIVATE', 'PUBLIC', 'TRUST', 'NGO');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."BloodGroup_new" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');
ALTER TABLE "public"."Patient" ALTER COLUMN "blood_group" TYPE "public"."BloodGroup_new" USING ("blood_group"::text::"public"."BloodGroup_new");
ALTER TYPE "public"."BloodGroup" RENAME TO "BloodGroup_old";
ALTER TYPE "public"."BloodGroup_new" RENAME TO "BloodGroup";
DROP TYPE "public"."BloodGroup_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Gender_new" AS ENUM ('MALE', 'FEMALE', 'OTHER');
ALTER TABLE "public"."Patient" ALTER COLUMN "gender" TYPE "public"."Gender_new" USING ("gender"::text::"public"."Gender_new");
ALTER TYPE "public"."Gender" RENAME TO "Gender_old";
ALTER TYPE "public"."Gender_new" RENAME TO "Gender";
DROP TYPE "public"."Gender_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Doctor" DROP CONSTRAINT "Doctor_hospitalId_fkey";

-- DropIndex
DROP INDEX "public"."Doctor_custom_doctor_Id_key";

-- DropIndex
DROP INDEX "public"."Patient_custom_patient_Id_key";

-- AlterTable
ALTER TABLE "public"."Doctor" DROP COLUMN "created_on",
DROP COLUMN "custom_doctor_Id",
DROP COLUMN "hospitalId",
DROP COLUMN "opdTiming",
DROP COLUMN "updated_on",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "custom_doctor_id" TEXT NOT NULL,
ADD COLUMN     "hospital_id" TEXT NOT NULL,
ADD COLUMN     "opd_timing" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Hospital" DROP CONSTRAINT "Hospital_pkey",
DROP COLUMN "HID",
DROP COLUMN "name",
ADD COLUMN     "admin_mobile_number" TEXT NOT NULL,
ADD COLUMN     "admin_name" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "custom_hospital_id" TEXT NOT NULL,
ADD COLUMN     "hospital_name" TEXT NOT NULL,
ADD COLUMN     "hospital_type" "public"."HospitalType" NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "pincode" VARCHAR(10) NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" TEXT NOT NULL,
ADD CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Patient" DROP COLUMN "created_on",
DROP COLUMN "custom_patient_Id",
DROP COLUMN "updated_on",
ADD COLUMN     "custom_patient_id" TEXT NOT NULL,
ALTER COLUMN "pincode" SET DATA TYPE VARCHAR(10);

-- CreateTable
CREATE TABLE "public"."Appointment" (
    "id" SERIAL NOT NULL,
    "patient_id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_custom_doctor_id_key" ON "public"."Doctor"("custom_doctor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_custom_hospital_id_key" ON "public"."Hospital"("custom_hospital_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_admin_mobile_number_key" ON "public"."Hospital"("admin_mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_custom_patient_id_key" ON "public"."Patient"("custom_patient_id");

-- AddForeignKey
ALTER TABLE "public"."Doctor" ADD CONSTRAINT "Doctor_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "public"."Hospital"("custom_hospital_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("custom_patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("custom_doctor_id") ON DELETE RESTRICT ON UPDATE CASCADE;
