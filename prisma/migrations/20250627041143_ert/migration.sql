/*
  Warnings:

  - Added the required column `user_id` to the `Reyting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reyting" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "chat_id" BIGINT NOT NULL,
    "is_bot" BOOLEAN,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reyting" ADD CONSTRAINT "Reyting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
