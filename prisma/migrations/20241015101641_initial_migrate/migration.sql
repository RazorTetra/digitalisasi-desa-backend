-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `namaDepan` VARCHAR(191) NOT NULL,
    `namaBelakang` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NULL,
    `nomorHp` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'SISWA') NOT NULL DEFAULT 'SISWA',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
