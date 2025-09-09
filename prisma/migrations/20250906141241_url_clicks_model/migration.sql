/*
  Warnings:

  - You are about to alter the column `shortCode` on the `Url` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(6)`.
  - You are about to alter the column `originalUrl` on the `Url` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.

*/
-- DropIndex
DROP INDEX "public"."Url_shortCode_idx";

-- AlterTable
ALTER TABLE "public"."Click" ADD COLUMN     "ip" VARCHAR(45),
ADD COLUMN     "userAgent" VARCHAR(512);

-- AlterTable
ALTER TABLE "public"."Url" ALTER COLUMN "shortCode" SET DATA TYPE VARCHAR(6),
ALTER COLUMN "originalUrl" SET DATA TYPE VARCHAR(2048);
