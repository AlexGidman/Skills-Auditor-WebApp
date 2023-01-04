const request = require("supertest");

const app = require("../../app");
const { mockModel, mockError } = require("./testing");

const mockCategory1 = { id: "1", name: "testname1" };
const mockCategory2 = { id: "2", name: "testname2" };

describe("/api/category", () => {
    describe("GET all", () => {
        it("should return 200 and categories when GET /api/category called successfully", async () => {
            const mockCategories = [mockCategory1, mockCategory2];
            mockModel.findAll.mockResolvedValue(mockCategories);

            const response = await request(app)
                .get("/api/category")
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.findAll).toHaveBeenCalled();
            expect(response.body).toEqual(mockCategories);
        });

        it("should return 400 and error when GET /api/category called with database error", async () => {
            mockModel.findAll.mockRejectedValue(mockError);

            const response = await request(app)
                .get("/api/category")
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });
    });

    describe("GET by id", () => {
        it("should return 200 and category when GET /api/category/:id called successfully", async () => {
            mockModel.findByPk.mockResolvedValue(mockCategory1);

            const response = await request(app)
                .get(`/api/category/${mockCategory1.id}`)
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.findByPk).toHaveBeenLastCalledWith(mockCategory1.id);
            expect(response.body).toEqual(mockCategory1);
        });

        it("should return 400 and error when GET /api/category/:id called with invalid id", async () => {
            const invalidId = "invalidID";
            mockModel.findByPk.mockResolvedValue(undefined);

            const response = await request(app)
                .get(`/api/category/${invalidId}`)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.findByPk).toHaveBeenLastCalledWith(invalidId);
            expect(response.body.error.message).toEqual(
                `Unable to find Category with id ${invalidId}`,
            );
        });

        it("should return 400 and error when GET /api/category/:id called with database error", async () => {
            mockModel.findByPk.mockRejectedValue(mockError);

            const response = await request(app)
                .get("/api/category/1")
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });
    });

    describe("POST", () => {
        it("should return 201 and category when POST /api/category called successfully", async () => {
            mockModel.create.mockResolvedValue(mockCategory1);
            const mockRequestBody = { name: mockCategory1.name };

            const response = await request(app)
                .post("/api/category")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(201);
            expect(mockModel.create).toHaveBeenLastCalledWith(mockRequestBody);
            expect(response.body).toEqual("Category created");
        });

        it("should return 400 and error when POST /api/category called without name", async () => {
            const response = await request(app)
                .post("/api/category")
                .send({ name: undefined })
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/category called with database error", async () => {
            mockModel.create.mockRejectedValue(mockError);
            const mockRequestBody = { name: mockCategory1.name };

            const response = await request(app)
                .post("/api/category")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });

        it("should return 400 and error when POST /api/category called with name that already exists", async () => {
            mockModel.findOne.mockResolvedValue(mockCategory1);
            const mockRequestBody = { name: mockCategory1.name };

            const response = await request(app)
                .post("/api/category")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual("Duplicate Entry");
        });
    });

    describe("PUT", () => {
        it("should return 200 and category when PUT /api/category called successfully", async () => {
            const updatedOneRecord = [1];
            mockModel.update.mockResolvedValue(updatedOneRecord);
            const mockRequestBody = {
                id: mockCategory1.id,
                name: "updated",
            };

            const response = await request(app)
                .put("/api/category")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.update).toHaveBeenLastCalledWith(
                { name: "updated" },
                { where: { id: mockRequestBody.id } },
            );
            expect(response.body).toEqual("Category updated");
        });

        it("should return 400 and error when PUT /api/category called without id", async () => {
            const mockRequestBody = {
                id: undefined,
                name: "updated",
            };

            const response = await request(app)
                .put("/api/category")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when PUT /api/category called without name", async () => {
            const mockRequestBody = {
                id: mockCategory1.id,
                name: undefined,
            };

            const response = await request(app)
                .put("/api/category")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/category called with invalid id", async () => {
            const updatedZeroRecords = [0];
            const invalidId = "invalidID";
            mockModel.update.mockResolvedValue(updatedZeroRecords);
            mockModel.findByPk.mockResolvedValue(undefined);
            const mockRequestBody = { id: invalidId, name: "updated" };

            const response = await request(app)
                .put("/api/category")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(
                `Unable to find Category with id ${invalidId}`,
            );
        });

        it("should return 400 and error when PUT /api/category called with existing name", async () => {
            const updatedZeroRecords = [0];
            mockModel.update.mockResolvedValue(updatedZeroRecords);
            mockModel.findByPk.mockResolvedValue(mockCategory1);

            const response = await request(app)
                .put("/api/category")
                .send(mockCategory1)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(
                "Unable to update Category - parameter values may already exist",
            );
        });

        it("should return 400 and error when PUT /api/category called with database error", async () => {
            mockModel.update.mockRejectedValue(mockError);
            const mockRequestBody = {
                id: mockCategory1.id,
                name: "updated",
            };

            const response = await request(app)
                .put("/api/category")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });

        it("should return 400 and error when PUT /api/category called with name that already exists", async () => {
            mockModel.findOne.mockResolvedValue(mockCategory1);
            const mockRequestBody = mockCategory1;

            const response = await request(app)
                .put("/api/category")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual("Duplicate Entry");
        });
    });

    describe("DELETE", () => {
        it("should return 200 when DELETE /api/category called successfully", async () => {
            mockModel.destroy.mockResolvedValue(1);
            const mockRequestBody = { id: mockCategory1.id };

            const response = await request(app)
                .delete("/api/category")
                .send(mockRequestBody)
                .expect("Content-Type", /text\/html; charset=utf-8/)
                .expect(200);
            expect(mockModel.destroy).toHaveBeenLastCalledWith({ where: { id: mockCategory1.id } });
            expect(response.text).toEqual("Category deleted");
        });

        it("should return 404 and error when DELETE /api/category called without id", async () => {
            const response = await request(app)
                .delete("/api/category")
                .send({ id: undefined })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(mockModel.destroy).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 404 and error when DELETE /api/category called with invalid id", async () => {
            mockModel.destroy.mockResolvedValue(0);
            const invalidId = "invalidID";
            const mockRequestBody = { id: invalidId };

            const response = await request(app)
                .delete("/api/category")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(404);
            expect(mockModel.destroy).toHaveBeenLastCalledWith({ where: { id: invalidId } });
            expect(response.body.error.message).toEqual("Id not found");
        });

        it("should return 404 and error when DELETE /api/category called with database error", async () => {
            mockModel.destroy.mockRejectedValue(mockError);

            const response = await request(app)
                .delete("/api/category")
                .send({ id: mockCategory1.id })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(response.body.error.message).toEqual(mockError.message);
        });

        it("should return 404 and error when DELETE /api/category called with skills associated", async () => {
            mockError.name = "SequelizeForeignKeyConstraintError";
            mockModel.destroy.mockRejectedValue(mockError);

            const response = await request(app)
                .delete("/api/category")
                .send({ id: mockCategory1.id })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(response.body.error.message).toEqual(
                "Cannot delete Category option - already assigned to Skill",
            );
            mockError.name = undefined;
        });
    });
});
