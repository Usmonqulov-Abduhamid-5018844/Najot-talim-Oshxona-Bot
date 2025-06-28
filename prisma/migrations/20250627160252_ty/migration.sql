-- DropForeignKey
ALTER TABLE "Reyting" DROP CONSTRAINT "Reyting_menyu_id_fkey";

-- AddForeignKey
ALTER TABLE "Reyting" ADD CONSTRAINT "Reyting_menyu_id_fkey" FOREIGN KEY ("menyu_id") REFERENCES "Menyu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
