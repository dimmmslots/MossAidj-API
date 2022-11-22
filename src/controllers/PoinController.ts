const prisma = require('../configs/database');

const PoinController = {
    getByKodePertemuan: async (req, res) => {
        try {
            const { kode_pertemuan } = req.params;
            const poin = await prisma.point.findMany({
                where: {
                    pertemuan: kode_pertemuan
                }
            });

            const quiz = await prisma.pertemuan.findUnique({
                where: {
                    id: kode_pertemuan
                },
                select: {
                    quiz: true
                }
            });

            if (poin.length === 0) {
                return res.status(404).json({
                    message: 'Poin dengan kode pertemuan ' + kode_pertemuan + ' tidak ditemukan'
                });
            }

            poin.map((p) => {
                delete p.pertemuan;
            });

            let split = kode_pertemuan.split('-');
            let kelas = split[0];
            let makul = split[1];
            let pertemuan = split[2];
            const response = {
                data: {
                    kelas: kelas,
                    makul: makul,
                    pertemuan: pertemuan,
                    quiz: quiz.quiz,
                    poin
                }
            }
            res.json(response);
        } catch (error) {

        }
    },
}

// PoinController.getByKodePertemuan = async (req, res) => {
//     const { kode_pertemuan } = req.params;
// };

export default PoinController;