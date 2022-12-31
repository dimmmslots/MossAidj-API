const prisma = require('../configs/database');
export const isExist = {
    pertemuan: async (kode_pertemuan: string) => {
        const pertemuanExists = await prisma.pertemuan.findUnique({
            where: {
                id: kode_pertemuan,
            },
        });
        if (!pertemuanExists) {
            return false;
        }
        return pertemuanExists;
    }
}