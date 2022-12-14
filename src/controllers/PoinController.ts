import { Prisma } from "@prisma/client";
import { pertemuan } from "../types/ApiResponse";
import { bodyRequest } from "../validators/bodyRequest";

const prisma = require("../configs/database");

const PoinController = {
  getByKodePertemuan: async (req, res) => {
    try {
      const { kode_pertemuan } = req.params;
      const pertemuanExists: pertemuan = await prisma.pertemuan.findUnique({
        where: {
          id: kode_pertemuan,
        },
      });
      if (!pertemuanExists) {
        return res.status(404).json({
          message:
            "Pertemuan dengan kode " + kode_pertemuan + " tidak ditemukan",
        });
      }
      const poin = await prisma.point.findMany({
        where: {
          pertemuan: kode_pertemuan,
        },
      });

      if (poin.length === 0) {
        return res.status(404).json({
          message:
            "Poin dengan kode pertemuan " + kode_pertemuan + " tidak ditemukan",
        });
      }

      poin.map((p) => {
        delete p.pertemuan;
        delete p.id;
      });

      let split = kode_pertemuan.split("-");
      let kelas: string = split[0];
      let makul: string = split[1];
      let pertemuan: string = split[2];
      const response = {
        kelas: kelas,
        makul: makul,
        pertemuan: pertemuan,
        data: poin,
      };
      res.status(200).json({
        message: "Poin berhasil ditemukan",
        data: response,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  },

  generatePoinByKodePertemuan: async (req, res) => {
    try {
      const { kode_pertemuan } = req.params;
      const pertemuanExists: pertemuan = await prisma.pertemuan.findUnique({
        where: {
          id: kode_pertemuan,
        },
      });
      if (!pertemuanExists) {
        return res.status(404).json({
          message:
            "Pertemuan dengan kode " + kode_pertemuan + " tidak ditemukan",
        });
      }
      const table_name = ("db_" + kode_pertemuan.substr(0, 9))
        .toLowerCase()
        .replace(/-/g, "_");
      let query = "SELECT * FROM " + table_name;
      // return res.json(table_name);
      const mahasiswa = await prisma.$queryRawUnsafe(query);
      let data = [];
      let quiz = pertemuanExists.quiz;
      let poin = "";
      if (quiz === "") {
        poin = "";
      } else {
        const quiz_length = quiz.split(",").length;
        for (let i = 1; i <= quiz_length; i++) {
          i === quiz_length ? (poin += "0") : (poin += "0,");
        }
      }
      mahasiswa.map((item) => {
        data.push({
          nim: item.nim,
          pertemuan: kode_pertemuan,
          poin: poin,
          quiz: pertemuanExists.quiz,
        });
      });
      const poinCreated = await prisma.point.createMany({
        data: data,
      });
      return res.json({
        message: "Poin berhasil dibuat",
        data: poinCreated,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  createPoint: async (req, res) => {
    try {
      const { kode_pertemuan } = req.params;
      const validate = await bodyRequest.createPoint.validateAsync(req.body);
      const { nim } = req.body;
      // check if pertemuan exists
      const pertemuan = await prisma.pertemuan.findUnique({
        where: {
          id: kode_pertemuan,
        },
      });
      if (!pertemuan) {
        return res.status(404).json({
          message:
            "Pertemuan dengan kode " + kode_pertemuan + " tidak ditemukan",
        });
      }
      // get all nim from point with kode_pertemuan
      const nims = await prisma.point.findMany({
        where: {
          pertemuan: kode_pertemuan,
        },
        select: {
          nim: true,
          id: true,
        },
      });

      // check if nim already exist, if exist then update the point
      const isExist = nims.find((n) => n.nim === nim);
      if (isExist) {
        return res.status(400).json({
          message: "Poin dengan nim " + nim + " sudah ada",
        });
      }

      // if nim not exist, then create new point
      let label_length = pertemuan.quiz.split(",").length;
      let poin = "0" + ",0".repeat(label_length - 1);

      const pointCreated = await prisma.point.create({
        data: {
          nim: nim,
          pertemuan: kode_pertemuan,
          poin: poin,
          quiz: pertemuan.quiz,
        },
      });
      res.status(201).json({
        message: "Poin berhasil ditambahkan",
        data: {
          nim: nim,
          pertemuan: kode_pertemuan,
          poin: poin,
          quiz: pertemuan.quiz,
        },
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  editPoint: async (req, res) => {
    try {
      const {kode_pertemuan, nim} = req.params;
      const validate = await bodyRequest.editPoint.validateAsync(req.body);
      const {poin} = req.body;
      // check if pertemuan exists
      const pertemuan = await prisma.pertemuan.findUnique({
        where: {
          id: kode_pertemuan,
        },
      });
      if (!pertemuan) {
        return res.status(404).json({
          message:
            "Pertemuan dengan kode " + kode_pertemuan + " tidak ditemukan",
        });
      }
      // check if point exists
      const point = await prisma.point.findFirst({
        where: {
          AND: [
            {
              pertemuan: kode_pertemuan,
            },
            {
              nim: nim,
            },
          ],
        },
      });
      if (!point) {
        return res.status(404).json({
          message:
            "Poin dengan nim " + nim + " tidak ditemukan",
        });
      }
      // check if poin is valid
      const quiz_length = pertemuan.quiz.split(",").length;
      const poin_length = poin.split(",").length;
      if (quiz_length !== poin_length) {
        return res.status(400).json({
          message: "Panjang poin tidak valid",
        });
      }
      // update point
      const pointUpdated = await prisma.point.update({
        where: {
          id: point.id,
        },
        data: {
          poin: poin,
        },
      });
      res.status(200).json({
        message: "Poin berhasil diubah",
        data: pointUpdated,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }
      return res.status(500).json({
        message: error.message,
      })
    }
  },

  deletePoint: async (req, res) => {
    try {
      // check if pertemuan exists
      const { kode_pertemuan, nim } = req.params;
      const pertemuan = await prisma.pertemuan.findUnique({
        where: {
          id: kode_pertemuan,
        },
      });
      if (!pertemuan) {
        return res.status(404).json({
          message:
            "Pertemuan dengan kode " + kode_pertemuan + " tidak ditemukan",
        });
      }
      // check if point exists
      const point = await prisma.point.findFirst({
        where: {
          AND: [
            {
              pertemuan: kode_pertemuan,
            },
            {
              nim: nim,
            },
          ],
        },
      });
      if (!point) {
        return res.status(404).json({
          message: "Poin dengan nim " + nim + " tidak ditemukan",
        });
      }
      // delete point
      const deletedPoint = await prisma.point.delete({
        where: {
          id: point.id,
        },
      });
      return res.json({
        message: "Poin berhasil dihapus",
        data: deletedPoint,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  },
};

export default PoinController;
