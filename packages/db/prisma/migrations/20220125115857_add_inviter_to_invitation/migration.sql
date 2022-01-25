/*
  Warnings:

  - Added the required column `inviterId` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "inviterId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
