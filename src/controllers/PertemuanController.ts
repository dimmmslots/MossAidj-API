const prisma = require("../configs/database");
import { bodyRequest } from "../validators/bodyRequest";
import { pertemuan } from "../types/ApiResponse";
import { isExist } from "../utils/isExist";

const PertemuanController = {
  createPertemuan: async (req, res, next) => {
    try {
      const { kelas, makul, pertemuan } = req.body;
      // validate body
      const validate = await bodyRequest.createPertemuan.validateAsync(
        req.body
      );
      const kode_pertemuan = kelas + "-" + makul + "-" + pertemuan;
      const pertemuanExists: pertemuan = await prisma.pertemuan.findUnique({
        where: {
          id: kode_pertemuan,
        },
      });
      if (pertemuanExists) {
        return res.status(409).json({
          message: "Pertemuan dengan kode " + kode_pertemuan + " sudah ada",
        });
      }
      const data: pertemuan = {
        id: kode_pertemuan,
        kelas: kelas,
        makul: makul,
        pertemuan: pertemuan,
        quiz: kode_pertemuan,
      };
      const pertemuanCreated = await prisma.pertemuan.create({
        data: data,
      });
      return res.status(201).json({
        message: "Pertemuan berhasil dibuat",
        data: data.id,
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

  editQuizLabelPertemuan: async (req, res) => {
    try {
      // get value from url params
      const { kode_pertemuan } = req.params;

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

      let { oldLabel, newLabel } = req.body;
      // validate body
      const validate = await bodyRequest.editQuizLabelPertemuan.validateAsync(
        req.body
      );
      oldLabel = oldLabel.toLowerCase();
      newLabel = newLabel.toLowerCase();
      let oldQuiz = pertemuanExists.quiz.split(",");
      if (!oldQuiz.includes(oldLabel)) {
        return res.status(404).json({
          message: "Label quiz '" + oldLabel + "' tidak ditemukan",
        });
      } else {
        if (newLabel == oldLabel) {
          return res.status(200).json({
            message: "Label quiz tidak diubah",
          });
        } else {
          if (oldQuiz.includes(newLabel)) {
            return res.status(409).json({
              message: "Label quiz '" + newLabel + "' sudah ada",
            });
          } else {
            let index = oldQuiz.indexOf(oldLabel);
            oldQuiz[index] = newLabel;
            let newQuiz = oldQuiz.join(",");
            const pertemuanUpdated = await prisma.pertemuan.update({
              where: {
                id: kode_pertemuan,
              },
              data: {
                quiz: newQuiz,
              },
            });
            return res.json({
              message: "Label quiz berhasil diubah",
              data: pertemuanUpdated,
            });
          }
        }
      }
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

  deleteQuizPertemuan: async (req, res) => {
    try {
      const { kode_pertemuan } = req.params;
      const pertemuanExists = await isExist.pertemuan(kode_pertemuan);

      if (!pertemuanExists) {
        return res.status(404).json({
          message:
            "Pertemuan dengan kode " + kode_pertemuan + " tidak ditemukan",
        });
      }

      let { label } = req.body;
      // validate body
      const validate = await bodyRequest.deleteQuizPertemuan.validateAsync(
        req.body
      );
      label = label.toLowerCase();
      let oldLabel = pertemuanExists.quiz.split(",");

      if (!oldLabel.includes(label)) {
        return res.status(400).json({
          message: "Label quiz '" + label + "' tidak ditemukan",
        });
      } else {
        const poin = await prisma.point.findMany({
          where: {
            pertemuan: kode_pertemuan,
          },
        });
        let index = oldLabel.indexOf(label);
        let newLabel = oldLabel.filter((item, i) => i !== index);
        let newQuiz = newLabel.join(",");
        poin.forEach(async (item) => {
          let oldPoin = item.poin.split(",");
          let newPoin = oldPoin.filter((item, i) => i !== index);
          let newPoinString = newPoin.join(",");
          await prisma.point.update({
            where: {
              id: item.id,
            },
            data: {
              poin: newPoinString,
            },
          });
        });
        const pertemuanUpdated = await prisma.pertemuan.update({
          where: {
            id: kode_pertemuan,
          },
          data: {
            quiz: newQuiz,
          },
        });
        return res.status(200).json({
          message: "Label quiz berhasil dihapus",
          data: pertemuanUpdated,
        });
      }
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

  addQuizPertemuan: async (req, res) => {
    try {
      // cek kode pertemuan dengan regex
      const { kode_pertemuan } = req.params;
      const pertemuanExists = await isExist.pertemuan(kode_pertemuan);
      if (!pertemuanExists) {
        return res.status(404).json({
          message:
            "Pertemuan dengan kode " + kode_pertemuan + " tidak ditemukan",
        });
      }
      let oldLabels = pertemuanExists.quiz.split(",");
      let { label } = req.body;
      // validate body
      const validate = await bodyRequest.addQuizPertemuan.validateAsync(
        req.body
      );
      if (typeof label !== "string") {
        return res.status(400).json({
          message: "Label quiz harus berupa string",
        });
      }
      label = label.toLowerCase();
      const poin = await prisma.point.findMany({
        where: {
          pertemuan: kode_pertemuan,
        },
      });

      if (oldLabels.includes(label)) {
        return res.status(400).json({
          message: "Label quiz '" + label + "' sudah ada",
        });
      } else {
        oldLabels.push(label);
        let newLabels = oldLabels.join(",");
        poin.forEach(async (item) => {
          let oldPoin = item.poin.split(",");
          oldPoin.push("0");
          let newPoin = oldPoin.join(",");
          await prisma.point.update({
            where: {
              id: item.id,
            },
            data: {
              poin: newPoin,
            },
          });
        });
        const pertemuanUpdated = await prisma.pertemuan.update({
          where: {
            id: kode_pertemuan,
          },
          data: {
            quiz: newLabels,
          },
        });
        return res.status(201).json({
          message: "Label quiz berhasil ditambahkan",
          data: pertemuanUpdated,
        });
      }
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

  deletePertemuan: async (req, res) => {
    try {
      const { kode_pertemuan } = req.params;
      const pertemuanExists = await isExist.pertemuan(kode_pertemuan);
      if (!pertemuanExists) {
        return res.status(404).json({
          message:
            "Pertemuan dengan kode " + kode_pertemuan + " tidak ditemukan",
        });
      } else {
        const pointDeleted = await prisma.point.deleteMany({
          where: {
            pertemuan: kode_pertemuan,
          },
        });
        const pertemuanDeleted = await prisma.pertemuan.delete({
          where: {
            id: kode_pertemuan,
          },
        });
        return res.status(200).json({
          message: "Pertemuan berhasil dihapus",
          data: pointDeleted,
        });
      }
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
};

export default PertemuanController;
