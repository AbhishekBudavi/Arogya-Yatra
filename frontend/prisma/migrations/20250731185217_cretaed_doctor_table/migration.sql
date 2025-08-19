-- CreateTable
CREATE TABLE "public"."Doctor" (
    "DID" SERIAL NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "opdTiming" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedOn" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("DID")
);

-- CreateTable
CREATE TABLE "public"."Hospital" (
    "HID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("HID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_phone_key" ON "public"."Doctor"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "public"."Doctor"("email");

-- AddForeignKey
ALTER TABLE "public"."Doctor" ADD CONSTRAINT "Doctor_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "public"."Hospital"("HID") ON DELETE RESTRICT ON UPDATE CASCADE;
