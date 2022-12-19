const prisma = require("../configs/database");
import { pertemuan } from "../interfaces/ApiResponse";

const PertemuanController = {
  createPertemuan: async (req, res) => {
    try {
      const { kelas, makul, pertemuan } = req.body;
      const kode_pertemuan = kelas + "-" + makul + "-" + pertemuan;
      const pertemuanExists: pertemuan = await prisma.pertemuan.findUnique({
        where: {
          id: kode_pertemuan,
        },
      });
      if (pertemuanExists) {
        return res.status(400).json({
          message: "Pertemuan dengan kode " + kode_pertemuan + " sudah ada",
        });
      }
      const data: pertemuan = {
        id: kode_pertemuan,
        kelas: kelas,
        makul: makul,
        pertemuan: pertemuan,
        quiz: "",
      };
      const pertemuanCreated = await prisma.pertemuan.create({
        data: data,
      });
      return res.json({
        message: "Pertemuan berhasil dibuat",
        data: pertemuanCreated,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  editQuizLabelPertemuan: async (req, res) => {
    try {
      // get value from url params
      const { kode_pertemuan } = req.params;
      // check kd_kelas format with regex
      const regex = new RegExp(
        /^[0-9][M|P][0-9][0-9]A-((ALG)|(DES))-\d{1}(\d)?$/i
      );
      if (!regex.test(kode_pertemuan)) {
        return res.status(400).json({
          message: "Kode kelas tidak sesuai format",
        });
      }

      // check if pertemuan exists
      const pertemuanExists = await prisma.pertemuan.findUnique({
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

      // get value from body
      let { label } = req.body;
      label = label.join(",");
      let quizUpdated = await prisma.pertemuan.update({
        where: {
          id: kode_pertemuan,
        },
        data: {
          quiz: label,
        },
      });

      const { id, ...data } = quizUpdated;

      return res.json({
        message: "Quiz berhasil diupdate",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  editQuizPertemuan: async (req, res) => {
    try {
      const { kode_pertemuan } = req.params;
      // check kd_kelas format with regex
      const regex = new RegExp(
        /^[0-9][M|P][0-9][0-9]A-((ALG)|(DES))-\d{1}(\d)?$/i
      );
      if (!regex.test(kode_pertemuan)) {
        return res.status(400).json({
          message: "Kode kelas tidak sesuai format",
        });
      }

      // check if pertemuan exists
      const pertemuanExists = await prisma.pertemuan.findUnique({
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

      let { label } = req.body;
      let oldLabel = pertemuanExists.quiz.split(",");

      let filteredLabel = oldLabel.filter((item, index) => {
        return !label.includes(item);
      });

      let indices = oldLabel
        .map((item, index) => {
          if (!label.includes(item)) {
            return index;
          }
        })
        .filter((item) => item !== undefined);

      let quizUpdated = await prisma.pertemuan.update({
        where: {
          id: kode_pertemuan,
        },
        data: {
          quiz: label.join(","),
        },
      });
      // get all poin with pertemuan id and delete poin with indices
      let poin = await prisma.point.findMany({
        where: {
          pertemuan: kode_pertemuan,
        },
      });

      let after = [];
      let poin_mahasiswa = poin;
      poin_mahasiswa.map((item, index) => {
        let oldPoint = item.poin.split(",");
        let newPoint = oldPoint.filter((item, index) => {
          return !indices.includes(index);
        });
        after.push(newPoint.join(","));
      });

      after.forEach(async (item, index) => {
        await prisma.point.update({
          where: {
            id: poin[index].id,
          },
          data: {
            poin: item,
          },
        });
      });

      return res.json({
        message: "Quiz berhasil diupdate"
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};

export default PertemuanController;
