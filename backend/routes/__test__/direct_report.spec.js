const request = require("supertest");

const app = require("../../app");
const { mockModel, mockError } = require("./testing");

const mockDirectReport1 = { id: "1", userId: "2", reportId: "3" };
const mockDirectReport2 = { id: "2", userId: "3", reportId: "1" };

describe("/api/directreport", () => {
    describe("GET all reports", () => {
        it("should return 200 and Direct Report when GET /api/directreport called successfully", async () => {
            const mockDirectReports = [mockDirectReport1, mockDirectReport2];
            mockModel.findAll.mockResolvedValue(mockDirectReports);

            const response = await request(app)
                .get(`/api/directreport/${mockDirectReport1.id}`)
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.findAll).toHaveBeenCalled();
            expect(response.body).toEqual([
                { id: mockDirectReport1.id },
                { id: mockDirectReport2.id },
            ]);
        });

        it("should return 400 and error when GET /api/directreport called with database error", async () => {
            mockModel.findAll.mockRejectedValue(mockError);

            const response = await request(app)
                .get(`/api/directreport/${mockDirectReport1.id}`)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });
    });

    describe("POST", () => {
        beforeEach(() => {
            mockModel.findByPk.mockResolvedValue({ systemRole: "Admin" });
        });
        it("should return 201 and Direct Report when POST /api/directreport called successfully", async () => {
            mockModel.create.mockResolvedValue(mockDirectReport1);
            const mockRequestBody = {
                userId: mockDirectReport1.userId,
                reportId: mockDirectReport1.reportId,
            };

            const response = await request(app)
                .post("/api/directreport")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(201);
            expect(mockModel.create).toHaveBeenLastCalledWith(mockRequestBody);
            expect(response.body).toEqual("Direct Report added");
        });

        it("should return 400 and error when POST /api/directreport called without userId", async () => {
            const response = await request(app)
                .post("/api/directreport")
                .send({ userId: undefined })
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/directreport called with database error", async () => {
            mockModel.create.mockRejectedValue(mockError);
            const mockRequestBody = {
                userId: mockDirectReport1.userId,
                reportId: mockDirectReport1.reportId,
            };

            const response = await request(app)
                .post("/api/directreport")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });

        it("should return 400 and error when POST /api/directreport called with matching user id and report id", async () => {
            const response = await request(app)
                .post("/api/directreport")
                .send({ userId: 1, reportId: 1 })
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("a manager cannot manage themselves!");
        });

        it("should return 201 and Direct Report when POST /api/directreport called by manager", async () => {
            mockModel.create.mockResolvedValue(mockDirectReport1);
            mockModel.findByPk.mockResolvedValue({ systemRole: "Manager" });
            const mockRequestBody = {
                userId: mockDirectReport1.userId,
                reportId: mockDirectReport1.reportId,
            };

            const response = await request(app)
                .post("/api/directreport")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(201);
            expect(mockModel.create).toHaveBeenLastCalledWith(mockRequestBody);
            expect(response.body).toEqual("Direct Report added");
        });
        it("should return 400 and error when POST /api/directreport called with duplicate relationship", async () => {
            mockModel.findOne.mockResolvedValue(mockDirectReport1);
            const response = await request(app)
                .post("/api/directreport")
                .send({ userId: 1, reportId: 2 })
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Duplicate Entry");
        });
        it("should return 400 and error when POST /api/directreport called with reverse relationship", async () => {
            mockModel.findOne.mockResolvedValueOnce(undefined); // no duplicates
            mockModel.findOne.mockResolvedValueOnce(mockDirectReport1);
            const response = await request(app)
                .post("/api/directreport")
                .send({ userId: 1, reportId: 2 })
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual(
                "Manager assignment error: A relationship has already been made",
            );
        });
    });

    describe("DELETE", () => {
        beforeEach(() => {
            mockModel.findByPk.mockResolvedValue({ systemRole: "Admin" });
        });
        it("should return 200 when DELETE /api/directreport called successfully", async () => {
            mockModel.destroy.mockResolvedValue(1);
            const mockRequestBody = { id: mockDirectReport1.id };

            const response = await request(app)
                .delete("/api/directreport")
                .send(mockRequestBody)
                .expect("Content-Type", /text\/html; charset=utf-8/)
                .expect(200);
            expect(mockModel.destroy).toHaveBeenLastCalledWith({
                where: { id: mockDirectReport1.id },
            });
            expect(response.text).toEqual("Direct Report deleted");
        });

        it("should return 404 and error when DELETE /api/directreport called without id", async () => {
            const response = await request(app)
                .delete("/api/directreport")
                .send({ id: undefined })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(mockModel.destroy).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 404 and error when DELETE /api/directreport called with invalid id", async () => {
            mockModel.destroy.mockResolvedValue(0);
            const invalidId = "invalidID";
            const mockRequestBody = { id: invalidId };

            const response = await request(app)
                .delete("/api/directreport")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(404);
            expect(mockModel.destroy).toHaveBeenLastCalledWith({ where: { id: invalidId } });
            expect(response.body.error.message).toEqual("Id not found");
        });

        it("should return 404 and error when DELETE /api/directreport called with database error", async () => {
            mockModel.destroy.mockRejectedValue(mockError);

            const response = await request(app)
                .delete("/api/directreport")
                .send({ id: mockDirectReport1.id })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(response.body.error.message).toEqual(mockError.message);
        });

        it("should return 200 and Direct Report when DELETE /api/directreport called by manager", async () => {
            mockModel.findByPk.mockResolvedValue({ systemRole: "Manager" });
            mockModel.destroy.mockResolvedValue(1);
            const mockRequestBody = { id: mockDirectReport1.id };

            const response = await request(app)
                .delete("/api/directreport")
                .send(mockRequestBody)
                .expect("Content-Type", /text\/html; charset=utf-8/)
                .expect(200);
            expect(mockModel.destroy).toHaveBeenLastCalledWith({
                where: { id: mockDirectReport1.id },
            });
            expect(response.text).toEqual("Direct Report deleted");
        });
    });
});
