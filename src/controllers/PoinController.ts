import { Prisma } from "@prisma/client";
import { pertemuan } from "../types/ApiResponse";

const prisma = require("../configs/database");

const PoinController = {
  getByKodePertemuan: async (req, res) => {
    try {
      const { kode_pertemuan } = req.params;
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
      res.json(response);
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
      const pertemuanExists : pertemuan = await prisma.pertemuan.findUnique({
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
      let quiz = pertemuanExists.quiz
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
      const { nim, poin } = req.body;
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
      const point = await prisma.point.create({
        data: {
          nim: nim,
          poin: poin,
          pertemuan: kode_pertemuan,
        },
      });
      // strip id from response
      delete point.id;
      res.json({
        message: "Poin berhasil ditambahkan",
        data: point,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  },

  editPoint: async (req, res) => {
    try {
      const { kode_pertemuan, nim } = req.params;
      const dataExist = await prisma.point.findFirst({
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
      if (!dataExist) {
        return res.status(404).json({
          message: "Data tidak ditemukan",
        });
      }
      let array = [];
      const body = Object.entries(req.body);
      body.forEach((item) => {
        array.push(item);
      });
      // delete the first 3 items in the array
      array = array.splice(2, array.length);
      let poin = "";
      array.map((item, index) => {
        if (index === array.length - 1) {
          poin += item[1];
        } else {
          poin += item[1] + ",";
        }
      });
      const editedPoint = await prisma.point.update({
        where: {
          id: dataExist.id,
        },
        data: {
          poin: poin,
        },
      });
      delete editedPoint.id;
      return res.json({
        message: "Poin berhasil diubah",
        data: editedPoint,
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
