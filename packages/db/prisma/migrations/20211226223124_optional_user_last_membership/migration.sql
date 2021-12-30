-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_lastMembershipId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lastMembershipId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lastMembershipId_fkey" FOREIGN KEY ("lastMembershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
