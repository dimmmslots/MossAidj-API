import supertest = require("supertest");
import createServer from "../utils/server";

const app = createServer();
const prisma = require("../configs/database");
const data = {
  kode_pertemuan: "3M41A-ALG-1",
  kode_pertemuan_poin404: "3M41A-ALG-2",
  kode_pertemuan_404: "3M41B-ALG-1",
  kode_poin_create: "1M41A-ALG-1",
  nimExist: "22.240.0001",
  nim: "22.240.0002",
};

describe("poin", () => {
  describe("GET poin by kode pertemuan", () => {
    describe("when kode pertemuan exists", () => {
      it("should return 200", () => {
        return supertest(app).get(`/poin/${data.kode_pertemuan}`).expect(200);
      });
      describe("when poin count is 0", () => {
        it("should return 404 and message `Poin dengan kode pertemuan {kode_pertemuan} tidak ditemukan`", () => {
          return supertest(app)
            .get(`/poin/${data.kode_pertemuan_poin404}`)
            .expect(404)
            .expect({
              message: `Poin dengan kode pertemuan ${data.kode_pertemuan_poin404} tidak ditemukan`,
            });
        });
      });
      describe("when poin count is greater than 0", () => {
        it("should return 200 and contains message `Poin berhasil ditemukan`", () => {
          return supertest(app)
            .get(`/poin/${data.kode_pertemuan}`)
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty("message");
              expect(res.body.message).toBe("Poin berhasil ditemukan");
            });
        });
      });
    });
    describe("when kode pertemuan does not exist", () => {
      it("should return 404 and contains message `Pertemuan dengan kode {kode_pertemuan} tidak ditemukan`", () => {
        return supertest(app)
          .get(`/poin/${data.kode_pertemuan_404}`)
          .expect(404)
          .expect((res) => {
            expect(res.body).toHaveProperty("message");
            expect(res.body.message).toBe(
              `Pertemuan dengan kode ${data.kode_pertemuan_404} tidak ditemukan`
            );
          });
      });
    });
  });
  describe("POST poin by kode pertemuan", () => {
    describe("given valid body", () => {
      describe("when kode pertemuan exists", () => {
        describe("when poin doesnt exists", () => {
          it("should return 201 and contains message `Poin berhasil ditambahkan`", () => {
            return supertest(app)
              .post(`/poin/${data.kode_poin_create}`)
              .send({
                nim: data.nim,
              })
              .expect(201)
              .expect((res) => {
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("Poin berhasil ditambahkan");
              });
          });
        });
        describe("when poin exists", () => {
          it("should return 400 and contains message `Poin dengan nim {nim} sudah ada`", () => {
            return supertest(app)
              .post(`/poin/${data.kode_poin_create}`)
              .send({
                nim: data.nim,
              })
              .expect(400)
              .expect((res) => {
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe(
                  `Poin dengan nim ${data.nim} sudah ada`
                );
              });
          });
        });
      });
      describe("when kode pertemuan does not exist", () => {
        it("should return 404 and contains message `Pertemuan dengan kode {kode_pertemuan} tidak ditemukan`", () => {
          return supertest(app)
            .post(`/poin/${data.kode_pertemuan_404}`)
            .send({
              nim: data.nim,
            })
            .expect(404)
            .expect((res) => {
              expect(res.body).toHaveProperty("message");
              expect(res.body.message).toBe(
                `Pertemuan dengan kode ${data.kode_pertemuan_404} tidak ditemukan`
              );
            });
        });
      });
    });
    describe("given invalid body", () => {
      describe("when nim is exists but empty", () => {
        it("should return 400 and contains message `Nim is not allowed to be empty`", () => {
          return supertest(app)
            .post(`/poin/${data.kode_poin_create}`)
            .send({
              nim: "",
            })
            .expect(400)
            .expect((res) => {
              expect(res.body).toHaveProperty("message");
              expect(res.body.message).toBe('"nim" is not allowed to be empty');
            });
        });
      });
      describe("when nim is not exists", () => {
        it("should return 400 and contains message `Nim is required`", () => {
          return supertest(app)
            .post(`/poin/${data.kode_poin_create}`)
            .send({})
            .expect(400)
            .expect((res) => {
              expect(res.body).toHaveProperty("message");
              expect(res.body.message).toBe('"nim" is required');
            });
        });
      });
    });
  });
  describe("PUT poin by kode pertemuan and nim", () => {
    describe("given valid body", () => {
      describe("when kode pertemuan exists", () => {
        describe("when nim exists", () => {
          describe("when poin length isnt equal to quiz length", () => {
            it("should return 400 and message '\"Panjang poin tidak valid\"'", async () => {
              const pertemuan = await prisma.pertemuan.findUnique({
                where: {
                  id: data.kode_poin_create,
                },
              });
              const quiz_length = pertemuan.quiz.split(",").length;
              let updatePoin = "1" + ",0".repeat(quiz_length+1);
              const response = await supertest(app)
                .put(`/poin/${data.kode_poin_create}/${data.nimExist}`)
                .send({
                  poin: updatePoin,
                })
                .expect(400)
                .expect((res) => {
                  expect(res.body).toHaveProperty("message");
                  expect(res.body.message).toBe("Panjang poin tidak valid");
                });
            });
          });
        });
        describe("when poin length is equal to quiz length", () => {
          it("should return 200", async () => {
            const pertemuan = await prisma.pertemuan.findUnique({
              where: {
                id: data.kode_poin_create,
              },
            });
            const quiz_length = pertemuan.quiz.split(",");
            const updatePoin = "1" + ",0".repeat(quiz_length - 1);
            const response = await supertest(app)
              .put(`/poin/${data.kode_poin_create}/${data.nimExist}`)
              .send({
                poin: updatePoin,
              })
              .expect(200)
              .expect((res) => {
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("Poin berhasil diubah");
              });
          });
        });
      });
      describe("when kode pertemuan does not exist", () => {});
    });

    describe("given invalid body", () => {
      describe("when poin is exists but empty", () => {
        it("should return 400 and message '\"poin is not allowed to be empty\"'",async ()=> {
            const response = await supertest(app)
            .put(`/poin/${data.kode_poin_create}/${data.nimExist}`)
            .send({
                poin: ""
            })
            .expect(400)
            .expect((res)=> {
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toBe("\"poin\" is not allowed to be empty")
            })
        })
      });
      describe("when poin is not exists", () => {
        it("should return 400 and message \"poin\" is required",async ()=> {
            const response = await supertest(app)
            .put(`/poin/${data.kode_poin_create}/${data.nimExist}`)
            .send({
                wrongProperty: "aaa"
            })
            .expect(400)
            .expect((res)=> {
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toBe("\"poin\" is required")
            })
        })
      });
    });
  });
  describe("DELETE poin by kode pertemuan and nim", () => {
    describe("when kode pertemuan exists", () => {
      describe("when nim exists", () => {
        it("should return 200 and contains message `Poin berhasil dihapus`", () => {
          return supertest(app)
            .delete(`/poin/${data.kode_poin_create}/${data.nim}`)
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty("message");
              expect(res.body.message).toBe("Poin berhasil dihapus");
            });
        });
      });
      describe("when nim does not exist", () => {
        it("should return 404 and contains message `Poin dengan kode pertemuan {kode_pertemuan} dan nim {nim} tidak ditemukan`", () => {
          return supertest(app)
            .delete(`/poin/${data.kode_poin_create}/1234567890`)
            .expect(404)
            .expect((res) => {
              expect(res.body).toHaveProperty("message");
              expect(res.body.message).toBe(
                `Poin dengan nim 1234567890 tidak ditemukan`
              );
            });
        });
      });
    });
    describe("when kode pertemuan does not exist", () => {
      it("should return 404 and contains message `Pertemuan dengan kode {kode_pertemuan} tidak ditemukan`", () => {
        return supertest(app)
          .delete(`/poin/${data.kode_pertemuan_404}/${data.nim}`)
          .expect(404)
          .expect((res) => {
            expect(res.body).toHaveProperty("message");
            expect(res.body.message).toBe(
              `Pertemuan dengan kode ${data.kode_pertemuan_404} tidak ditemukan`
            );
          });
      });
    });
  });
  // describe("GET generate poin by kode pertemuan", () => {});
});
