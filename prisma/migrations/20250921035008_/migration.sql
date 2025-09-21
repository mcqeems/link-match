/*
  Warnings:

  - The primary key for the `conversation_participants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `conversation_participants` DROP FOREIGN KEY `conversation_participants_ibfk_2`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_ibfk_2`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `profile_ibfk_1`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_ibfk_1`;

-- AlterTable
ALTER TABLE `conversation_participants` DROP PRIMARY KEY,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`conversation_id`, `user_id`);

-- AlterTable
ALTER TABLE `messages` MODIFY `sender_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `profile` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `image_url` VARCHAR(255) NULL,
    ADD COLUMN `password` TEXT NOT NULL,
    ADD COLUMN `role_id` INTEGER NOT NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `email` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `users`;

-- CreateIndex
CREATE INDEX `idx_User_email` ON `user`(`email`);

-- CreateIndex
CREATE INDEX `idx_User_role_id` ON `user`(`role_id`);

-- AddForeignKey
ALTER TABLE `conversation_participants` ADD CONSTRAINT `conversation_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `User_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user_email_key` TO `email`;
