-- CreateTable
CREATE TABLE `Point` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nim` VARCHAR(191) NOT NULL,
    `pertemuan` VARCHAR(191) NOT NULL,
    `poin` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pertemuan` (
    `id` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `makul` ENUM('ALG', 'DES') NOT NULL DEFAULT 'ALG',
    `pertemuan` VARCHAR(191) NOT NULL,
    `quiz` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Pertemuan_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
