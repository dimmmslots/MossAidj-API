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

  editQuizPertemuan: async (req, res) => {
    try {
      const id_pertemuan = req.params.kode_pertemuan;
      // iterate through req.body and insert it into an array
      let array = [];
      const body = Object.entries(req.body);
      body.forEach((item) => {
        array.push(item);
      });
      array = array.splice(3, array.length);
      let quiz = "";
      array.map((item, index) => {
        if (index === array.length - 1) {
          quiz += item[1];
        } else {
          quiz += item[1] + ",";
        }
      });
      const pertemuanExists: pertemuan = await prisma.pertemuan.findUnique({
        where: {
          id: id_pertemuan,
        },
      });
      if (!pertemuanExists) {
        return res.status(400).json({
          message: "Pertemuan dengan kode " + id_pertemuan + " tidak ada",
        });
      }

      let mahasiswa = await prisma.point.findMany({
        where: {
          pertemuan: pertemuanExists.id,
        },
      });
      let old_poin_length = 0;
      let new_poin_length = quiz.split(",").length;
      if (mahasiswa.length > 0) {
        if (mahasiswa[0].poin !== "") {
          old_poin_length = mahasiswa[0].poin.split(",").length;
        } else {
          old_poin_length = 0;
        }
      }
      // compare the length of quiz and the length of the array
      if (new_poin_length === 0) {
        mahasiswa.map(async (item) => {
          await prisma.point.update({
            where: {
              id: item.id,
            },
            data: {
              poin: "",
            },
          });
        })
      } else if (new_poin_length > old_poin_length) {
        let diff = new_poin_length - old_poin_length;
        let addition = "";
        if(diff === 1) {
          addition = ",0";
        } else {
          for (let i = 1; i <= diff; i++) {
            i === diff ? (addition += "0") : (addition += "0,");
          }
        } 
        mahasiswa.forEach(async (item) => {
          item.poin += addition;
          await prisma.point.update({
            where: {
              id: item.id,
            },
            data: {
              poin: item.poin,
            },
          });
        });
      } else if (new_poin_length < old_poin_length) {
        let diff = old_poin_length - new_poin_length;
        // substract the poin by 2 * diff from the back of the string
        mahasiswa.forEach(async (item) => {
          item.poin = item.poin.slice(0, -2 * diff);
          await prisma.point.update({
            where: {
              id: item.id,
            },
            data: {
              poin: item.poin,
            },
          });
        });
      }

      const pertemuanUpdated = await prisma.pertemuan.update({
        where: {
          id: id_pertemuan,
        },
        data: {
          quiz: quiz,
        },
      });
      return res.json({
        message: "Quiz pertemuan berhasil diubah",
        data: pertemuanUpdated,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};

export default PertemuanController;
