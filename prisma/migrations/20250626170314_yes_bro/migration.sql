-- CreateTable
CREATE TABLE "Menyu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "avg_reytig" DOUBLE PRECISION NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Menyu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reyting" (
    "id" SERIAL NOT NULL,
    "ball" INTEGER NOT NULL,
    "menyu_id" INTEGER NOT NULL,

    CONSTRAINT "Reyting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reyting" ADD CONSTRAINT "Reyting_menyu_id_fkey" FOREIGN KEY ("menyu_id") REFERENCES "Menyu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
