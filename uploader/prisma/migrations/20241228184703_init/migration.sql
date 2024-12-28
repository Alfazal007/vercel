/*
  Warnings:

  - You are about to drop the column `projectName` on the `Projects` table. All the data in the column will be lost.
  - Added the required column `state` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('UPLOADING', 'DEPLOYING', 'DEPLOYED');

-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "projectName",
ADD COLUMN     "state" "State" NOT NULL;
