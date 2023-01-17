const request = require("supertest");

const app = require("../../app");
const { mockModel, mockError } = require("./testing");

const mockSkill1 = { id: "1", name: "testname1", categoryId: "1" };
const mockSkill2 = { id: "2", name: "testname2", categoryId: "1" };

describe("/api/skill", () => {
    describe("GET all", () => {
        it("should return 200 and skills when GET /api/skill called successfully", async () => {
            const mockSkills = [mockSkill1, mockSkill2];
            mockModel.findAll.mockResolvedValue(mockSkills);

            const response = await request(app)
                .get("/api/skill")
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.findAll).toHaveBeenCalled();
            expect(response.body).toEqual(mockSkills);
        });

        it("should return 400 and error when GET /api/skill called with database error", async () => {
            mockModel.findAll.mockRejectedValue(mockError);

            const response = await request(app)
                .get("/api/skill")
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });
    });

    describe("GET by id", () => {
        it("should return 200 and skill when GET /api/skill/:id called successfully", async () => {
            mockModel.findByPk.mockResolvedValue(mockSkill1);

            const response = await request(app)
                .get(`/api/skill/${mockSkill1.id}`)
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.findByPk).toHaveBeenLastCalledWith(mockSkill1.id, expect.anything());
            expect(response.body).toEqual(mockSkill1);
        });

        it("should return 400 and error when GET /api/skill/:id called with invalid id", async () => {
            const invalidId = "invalidID";
            mockModel.findByPk.mockResolvedValue(undefined);

            const response = await request(app)
                .get(`/api/skill/${invalidId}`)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.findByPk).toHaveBeenLastCalledWith(invalidId, expect.anything());
            expect(response.body.error.message).toEqual(
                `Unable to find Skill with id ${invalidId}`,
            );
        });

        it("should return 400 and error when GET /api/skill/:id called with database error", async () => {
            mockModel.findByPk.mockRejectedValue(mockError);

            const response = await request(app)
                .get("/api/skill/1")
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });
    });

    describe("POST", () => {
        it("should return 201 and skill when POST /api/skill called successfully", async () => {
            mockModel.create.mockResolvedValue(mockSkill1);
            const mockRequestBody = { name: mockSkill1.name, categoryId: mockSkill1.categoryId };

            const response = await request(app)
                .post("/api/skill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(201);
            expect(mockModel.create).toHaveBeenLastCalledWith(mockRequestBody);
            expect(response.body).toEqual("Skill created");
        });

        it("should return 400 and error when POST /api/skill called without name", async () => {
            const response = await request(app)
                .post("/api/skill")
                .send({ name: undefined, categoryId: mockSkill1.categoryId })
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/skill called without categoryId", async () => {
            const response = await request(app)
                .post("/api/skill")
                .send({ name: mockSkill1.name, categoryId: undefined })
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/skill called with database error", async () => {
            mockModel.create.mockRejectedValue(mockError);
            const mockRequestBody = { name: mockSkill1.name, categoryId: mockSkill1.categoryId };

            const response = await request(app)
                .post("/api/skill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });

        it("should return 400 and error when POST /api/skill called with name and categoryId that already exists", async () => {
            mockModel.findOne.mockResolvedValue(mockSkill1);
            const mockRequestBody = { name: mockSkill1.name, categoryId: mockSkill1.categoryId };

            const response = await request(app)
                .post("/api/skill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual("Duplicate Entry");
        });
    });

    describe("PUT", () => {
        it("should return 200 and skill when PUT /api/skill called successfully", async () => {
            const updatedOneRecord = [1];
            mockModel.update.mockResolvedValue(updatedOneRecord);
            const mockRequestBody = {
                id: mockSkill1.id,
                name: "updated",
                categoryId: "2",
            };

            const response = await request(app)
                .put("/api/skill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.update).toHaveBeenLastCalledWith(
                { name: "updated", categoryId: "2" },
                { where: { id: mockRequestBody.id } },
            );
            expect(response.body).toEqual("Skill updated");
        });

        it("should return 400 and error when PUT /api/skill called without id", async () => {
            const mockRequestBody = {
                id: undefined,
                name: "updated",
                categoryId: "2",
            };

            const response = await request(app)
                .put("/api/skill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when PUT /api/skill called without name", async () => {
            const mockRequestBody = {
                id: mockSkill1.id,
                name: undefined,
                categoryId: "2",
            };

            const response = await request(app)
                .put("/api/skill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when PUT /api/skill called without categoryId", async () => {
            const mockRequestBody = {
                id: mockSkill1.id,
                name: "updated",
                categoryId: undefined,
            };

            const response = await request(app)
                .put("/api/skill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/skill called with invalid id", async () => {
            const updatedZeroRecords = [0];
            const invalidId = "invalidID";
            mockModel.update.mockResolvedValue(updatedZeroRecords);
            mockModel.findByPk.mockResolvedValue(undefined);
            const mockRequestBody = {
                id: invalidId,
                name: "updated",
                categoryId: "2",
            };

            const response = await request(app)
                .put("/api/skill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(
                `Unable to find Skill with id ${invalidId}`,
            );
        });

        it("should return 400 and error when PUT /api/skill called with existing name and categoryId", async () => {
            const updatedZeroRecords = [0];
            mockModel.update.mockResolvedValue(updatedZeroRecords);
            mockModel.findByPk.mockResolvedValue(mockSkill1);

            const response = await request(app)
                .put("/api/skill")
                .send(mockSkill1)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(
                "Unable to update Skill - parameter values may already exist",
            );
        });

        it("should return 400 and error when PUT /api/skill called with database error", async () => {
            mockModel.update.mockRejectedValue(mockError);
            const mockRequestBody = {
                id: mockSkill1.id,
                name: "updated",
                categoryId: "2",
            };

            const response = await request(app)
                .put("/api/skill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });

        it("should return 400 and error when PUT /api/skill called with name that already exists", async () => {
            mockModel.findOne.mockResolvedValue(mockSkill1);
            const mockRequestBody = mockSkill1;

            const response = await request(app)
                .put("/api/skill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual("Duplicate Entry");
        });
    });

    describe("DELETE", () => {
        it("should return 200 when DELETE /api/skill called successfully", async () => {
            mockModel.destroy.mockResolvedValue(1);
            const mockRequestBody = { id: mockSkill1.id };

            const response = await request(app)
                .delete("/api/skill")
                .send(mockRequestBody)
                .expect("Content-Type", /text\/html; charset=utf-8/)
                .expect(200);
            expect(mockModel.destroy).toHaveBeenLastCalledWith({ where: { id: mockSkill1.id } });
            expect(response.text).toEqual("Skill deleted");
        });

        it("should return 404 and error when DELETE /api/skill called without id", async () => {
            const response = await request(app)
                .delete("/api/skill")
                .send({ id: undefined })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(mockModel.destroy).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 404 and error when DELETE /api/skill called with invalid id", async () => {
            mockModel.destroy.mockResolvedValue(0);
            const invalidId = "invalidID";
            const mockRequestBody = { id: invalidId };

            const response = await request(app)
                .delete("/api/skill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(404);
            expect(mockModel.destroy).toHaveBeenLastCalledWith({ where: { id: invalidId } });
            expect(response.body.error.message).toEqual("Id not found");
        });

        it("should return 404 and error when DELETE /api/skill called with database error", async () => {
            mockModel.destroy.mockRejectedValue(mockError);

            const response = await request(app)
                .delete("/api/skill")
                .send({ id: mockSkill1.id })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(response.body.error.message).toEqual(mockError.message);
        });

        it("should return 404 and error when DELETE /api/skill called with user skills associated", async () => {
            mockError.name = "SequelizeForeignKeyConstraintError";
            mockModel.destroy.mockRejectedValue(mockError);

            const response = await request(app)
                .delete("/api/skill")
                .send({ id: mockSkill1.id })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(response.body.error.message).toEqual(
                "Cannot delete Skill option - already assigned to User Skills",
            );
            mockError.name = undefined;
        });
    });
});
