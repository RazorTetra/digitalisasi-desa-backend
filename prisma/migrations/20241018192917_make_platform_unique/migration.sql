/*
  Warnings:

  - A unique constraint covering the columns `[platform]` on the table `SocialMedia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SocialMedia_platform_key" ON "SocialMedia"("platform");
