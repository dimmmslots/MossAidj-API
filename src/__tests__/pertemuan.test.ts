import supertest = require("supertest");
import createServer from "../utils/server";

const app = createServer();
const data = {
  kelasCreate: "3M42A",
  kodeCreate: "3M42A-ALG-1",
  kode409: "1M42A-ALG-1",
  kode404: "3M41B-ALG-2",
  kelas409: "1M42A",
  makul: "ALG",
  pertemuan: "1",
  label: "Quiz 1",
  newLabel: "Quiz 2",
  oldLabel: "Quiz 1",
};

describe("pertemuan", () => {
  describe("createPertemuan", () => {
    describe("given valid body", () => {
      describe("when pertemuan does not exist", () => {
        it("should return 201", async () => {
          const response = await supertest(app).post("/pertemuan").send({
            kelas: data.kelasCreate,
            makul: data.makul,
            pertemuan: data.pertemuan,
          });
          expect(response.status).toBe(201);
        });
      });

      describe("when pertemuan exists", () => {
        it("should return 409", async () => {
          const response = await supertest(app).post("/pertemuan").send({
            kelas: data.kelas409,
            makul: data.makul,
            pertemuan: data.pertemuan,
          });
          expect(response.status).toBe(409);
        });
      });
    });
    describe("given invalid body", () => {
      describe("when kelas is not provided", () => {
        it("should return 400", async () => {
          const response = await supertest(app).post("/pertemuan").send({
            makul: data.makul,
            pertemuan: data.pertemuan,
          });
          expect(response.status).toBe(400);
        });
      });
      describe("when makul is not provided", () => {
        it("should return 400", async () => {
          const response = await supertest(app).post("/pertemuan").send({
            kelas: data.kelasCreate,
            pertemuan: data.pertemuan,
          });
          expect(response.status).toBe(400);
        });
      });
      describe("when pertemuan is not provided", () => {
        it("should return 400", async () => {
          const response = await supertest(app).post("/pertemuan").send({
            kelas: data.kelasCreate,
            makul: data.makul,
          });
          expect(response.status).toBe(400);
        });
      });
    });
  });
  describe("editQuizLabelPertemuan", () => {
    describe("given valid body", () => {
      describe("when pertemuan exists", () => {
        describe("when label exists", () => {});
      });
    });

    describe("given invalid body", () => {
      describe("when label is not provided", () => {
        it("should return 400", async () => {
          const response = await supertest(app)
            .post(`/pertemuan/label/${data.kode409}`)
            .send({});
          expect(response.status).toBe(400);
        });
      });
    });
  });
  describe("addQuizPertemuan", () => {
    describe("given valid body", () => {
      describe("when pertemuan exists", () => {
        it("should return 201", async () => {
          const response = await supertest(app)
            .post(`/pertemuan/addquiz/${data.kode409}`)
            .send({
              label: data.label,
            });
          expect(response.status).toBe(201);
        });
      });

      describe("when pertemuan does not exist", () => {
        it("should return 404", async () => {
          const response = await supertest(app)
            .post(`/pertemuan/addquiz/${data.kode404}`)
            .send({
              label: data.label,
            });
          expect(response.status).toBe(404);
        });
      });
    });

    describe("given invalid body", () => {
      describe("when label is not provided", () => {
        it("should return 400", async () => {
          const response = await supertest(app)
            .post(`/pertemuan/addquiz/${data.kode409}`)
            .send({});
          expect(response.status).toBe(400);
        });
      });
    });
  });
  describe("deleteQuizPertemuan", () => {
    describe("given valid body", () => {
      describe("when pertemuan exists", () => {
        it("should return 200", async () => {
          const response = await supertest(app)
            .post(`/pertemuan/delquiz/${data.kode409}`)
            .send({
              label: data.label,
            });
          expect(response.status).toBe(200);
        });
      });

      describe("when pertemuan does not exist", () => {
        it("should return 404", async () => {
          const response = await supertest(app)
            .post(`/pertemuan/delquiz/${data.kode404}`)
            .send({
              label: data.label,
            });
          expect(response.status).toBe(404);
        });
      });
    });

    describe("given invalid body", () => {
      describe("when label is not provided", () => {
        it("should return 400", async () => {
          const response = await supertest(app)
            .post(`/pertemuan/delquiz/${data.kode409}`)
            .send({});
          expect(response.status).toBe(400);
        });
      });
    });
  });
  describe("deletePertemuan", () => {
    describe("when pertemuan exists", () => {
      it("should return 200", async () => {
        const response = await supertest(app).delete(
          `/pertemuan/${data.kodeCreate}`
        );
        expect(response.status).toBe(200);
      });
    });
  });
});
