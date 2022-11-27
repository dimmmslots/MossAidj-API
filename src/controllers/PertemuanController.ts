const prisma = require("../configs/database");

const PertemuanController = {
  createPertemuan: async (req, res) => {
    try {
      const { kelas, makul, pertemuan } = req.body;
      const kode_pertemuan = kelas + "-" + makul + "-" + pertemuan;
      const pertemuanExists = await prisma.pertemuan.findUnique({
        where: {
          id: kode_pertemuan,
        },
      });
      if (pertemuanExists) {
        return res.status(400).json({
          message: "Pertemuan dengan kode " + kode_pertemuan + " sudah ada",
        });
      }
      const pertemuanCreated = await prisma.pertemuan.create({
        data: {
          id: kode_pertemuan,
          kelas: kelas,
          makul: makul,
          pertemuan: pertemuan,
          quiz: "",
        },
      });
      delete pertemuanCreated.quiz;
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
      const pertemuanExists = await prisma.pertemuan.findUnique({
        where: {
          id: id_pertemuan,
        },
      });
      if (!pertemuanExists) {
        return res.status(400).json({
          message: "Pertemuan dengan kode " + id_pertemuan + " tidak ada",
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
    } catch (error) {}
  },
};

export default PertemuanController;
