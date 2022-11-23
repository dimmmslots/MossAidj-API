import { getPoinByKodePertemuanResponse } from "../interfaces/ApiResponse";

const prisma = require('../configs/database');
const { getPoinByKodePertemuanResponse, failedResponse, Poin } = require('../interfaces/ApiResponse');

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
            let kelas: string = split[0];
            let makul: string = split[1];
            let pertemuan: string = split[2];
            const response: getPoinByKodePertemuanResponse = {
                kelas: kelas,
                makul: makul,
                pertemuan: pertemuan,
                quiz: quiz.quiz,
                data: poin
            }
            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: error.message
            });
        }
    },

    createPoint: async (req, res) => {
        try {
            const { kode_pertemuan } = req.params;
            const { nim, poin } = req.body;
            // check if pertemuan exists
            const pertemuan = await prisma.pertemuan.findUnique({
                where: {
                    id: kode_pertemuan
                }
            });
            if (!pertemuan) {
                return res.status(404).json({
                    message: 'Pertemuan dengan kode ' + kode_pertemuan + ' tidak ditemukan'
                });
            }
            // get all nim from point with kode_pertemuan
            const nims = await prisma.point.findMany({
                where: {
                    pertemuan: kode_pertemuan
                },
                select: {
                    nim: true,
                    id: true
                }
            });

            // check if nim already exist, if exist then update the point
            const isExist = nims.find((n) => n.nim === nim);
            if (isExist) {
                const editedPoint = await prisma.point.update({
                    where: {
                        id: isExist.id
                    },
                    data: {
                        poin: poin
                    }
                });
                delete editedPoint.id;
                return res.json({
                    message: 'Poin berhasil diubah',
                    data: editedPoint
                });
            }

            // if nim not exist, then create new point
            const point = await prisma.point.create({
                data: {
                    nim: nim,
                    poin: poin,
                    pertemuan: kode_pertemuan
                }
            });
            // strip id from response
            delete point.id;
            res.json({
                message: 'Poin berhasil ditambahkan',
                data: point
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: error.message
            });
        }
    }
}


export default PoinController;