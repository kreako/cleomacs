/*
  Warnings:

  - You are about to drop the `LostPasswordToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LostPasswordToken" DROP CONSTRAINT "LostPasswordToken_userId_fkey";

-- DropTable
DROP TABLE "LostPasswordToken";
