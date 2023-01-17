const request = require("supertest");

const app = require("../../app");
const { mockModel, mockError } = require("./testing");

const mockUserSkill1 = {
    userId: 1,
    skillId: 1,
    skillLevel: 1,
    notes: "Test Notes",
    expiryDate: "2025-02-23",
};

const user1 = {
    userId: {
        id: 1,
        firstName: "Test",
        lastName: "User",
        email: "test-user@email.co.uk",
        password: "password",
        systemRole: "Manager",
        jobRole: "Expert Engineer",
    },
};

const skill1 = {
    skillId: {
        id: 1,
        name: "TestSkill1",
        categoryId: 1,
    },
};

const skill2 = {
    skillId: {
        id: 2,
        name: "TestSkill1",
        categoryId: 1,
    },
};

const mockUserSkill2 = {
    userId: 1,
    skillId: 2,
    skillLevel: 3,
    notes: "Test Notes 2",
    expiryDate: null,
};

describe("/api/userskill", () => {
    describe("GET all", () => {
        // No longer applicable for route
        it("should return 200 and userskills when GET /api/userskill called successfully", async () => {
            const mockUserSkills = [
                { ...mockUserSkill1, ...skill1 },
                { ...mockUserSkill2, ...skill2 },
            ];
            mockModel.findAll.mockResolvedValue(mockUserSkills);

            const response = await request(app)
                .get("/api/userskill")
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.findAll).toHaveBeenCalled();
            expect(response.body).toEqual(mockUserSkills);
        });

        it("should return 400 and error when GET /api/userskill called with database error", async () => {
            mockModel.findAll.mockRejectedValue(mockError);

            const response = await request(app)
                .get("/api/userskill")
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });
    });

    describe("GET by user id", () => {
        it("should return 200 and userskills when GET /api/userskill/byuser/:id called successfully", async () => {
            mockModel.findAll.mockResolvedValue([
                { ...mockUserSkill1, ...user1, ...skill1 },
                { ...mockUserSkill2, ...user1, ...skill2 },
            ]);

            expect(mockModel.findAll).not.toHaveBeenCalled();
            const response = await request(app)
                .get(`/api/userskill/byuser/${user1.id}`)
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.findAll).toHaveBeenCalledTimes(1);
            expect(response.body).toEqual([
                { ...mockUserSkill1, ...user1, ...skill1 },
                { ...mockUserSkill2, ...user1, ...skill2 },
            ]);
        });

        it("should return 400 and error when GET /api/userskill/byuser/:id called with invalid id", async () => {
            const invalidId = "invalidID";

            const response = await request(app)
                .get(`/api/userskill/byuser/${invalidId}`)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.findAll).toHaveBeenCalledTimes(1);
            expect(response.body.error.message).toEqual(
                `Unable to find User Skills for user id ${invalidId}`,
            );
        });

        it("should return 400 and error when GET /api/userskill/byuser/:id called with database error", async () => {
            mockModel.findAll.mockRejectedValue(mockError);

            const response = await request(app)
                .get(`/api/userskill/byuser/${user1.id}`)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });
    });

    describe("POST", () => {
        it("should return 201 and userskill when POST /api/userskill called successfully", async () => {
            mockModel.create.mockResolvedValue({ ...mockUserSkill1, ...user1, ...skill1 });

            const response = await request(app)
                .post("/api/userskill")
                .send(mockUserSkill1)
                .expect("Content-Type", /json/)
                .expect(201);
            expect(mockModel.create).toHaveBeenLastCalledWith(mockUserSkill1);
            expect(response.body).toEqual("User Skill added");
        });

        it("should return 201 and userskill when POST /api/userskill called without expiryDate", async () => {
            mockModel.create.mockResolvedValue(mockUserSkill1);
            const mockRequestBody = {
                userId: 1,
                skillId: 1,
                skillLevel: 1,
                notes: "Test Notes",
                expiryDate: undefined,
            };

            const response = await request(app)
                .post("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(201);
            expect(mockModel.create).toHaveBeenLastCalledWith({
                ...mockUserSkill1,
                expiryDate: null,
            });
            expect(response.body).toEqual("User Skill added");
        });

        it("should return 400 and error when POST /api/userskill called without userId", async () => {
            const mockRequestBody = {
                userId: undefined,
                skillId: 1,
                skillLevel: 1,
                notes: "Test Notes",
                expiryDate: "2025-02-23",
            };

            const response = await request(app)
                .post("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/userskill called without skillId", async () => {
            const mockRequestBody = {
                userId: 1,
                skillId: undefined,
                skillLevel: 1,
                notes: "Test Notes",
                expiryDate: "2025-02-23",
            };

            const response = await request(app)
                .post("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/userskill called without skillLevel", async () => {
            const mockRequestBody = {
                userId: 1,
                skillId: 1,
                skillLevel: undefined,
                notes: "Test Notes",
                expiryDate: "2025-02-23",
            };

            const response = await request(app)
                .post("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/userskill called without notes", async () => {
            const mockRequestBody = {
                userId: 1,
                skillId: 1,
                skillLevel: 1,
                notes: undefined,
                expiryDate: "2025-02-23",
            };

            const response = await request(app)
                .post("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/userskill called with notes shorter than 5 chars", async () => {
            const mockRequestBody = {
                userId: 1,
                skillId: 1,
                skillLevel: 1,
                notes: "1234",
                expiryDate: "2025-02-23",
            };

            const response = await request(app)
                .post("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual(
                "Notes must contain a minimum of 5 characters and a maximum of 255 characters",
            );
        });

        it("should return 400 and error when POST /api/userskill called with notes longer than 255 chars", async () => {
            const mockRequestBody = {
                userId: 1,
                skillId: 1,
                skillLevel: 1,
                notes:
                    "thisStringIsGreaterThan255CharactersthisStringIsGreaterThan255CharactersthisStringIsGreaterThan255Characters" +
                    "thisStringIsGreaterThan255CharactersthisStringIsGreaterThan255CharactersthisStringIsGreaterThan255Characters" +
                    "thisStringIsGreaterThan255CharactersthisStringIsGreaterThan255CharactersthisStringIsGreaterThan255Characters" +
                    "thisStringIsGreaterThan255CharactersthisStringIsGreaterThan255CharactersthisStringIsGreaterThan255Characters",
                expiryDate: "2025-02-23",
            };

            const response = await request(app)
                .post("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual(
                "Notes must contain a minimum of 5 characters and a maximum of 255 characters",
            );
        });

        it("should return 400 and error when POST /api/userskill called with database error", async () => {
            mockModel.create.mockRejectedValue(mockError);

            const response = await request(app)
                .post("/api/userskill")
                .send(mockUserSkill1)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });

        it("should return 400 and error when POST /api/userskill called with duplate userId and skillId", async () => {
            mockModel.findOne.mockResolvedValue(mockUserSkill1);
            mockModel.create.mockRejectedValue(mockError);

            const response = await request(app)
                .post("/api/userskill")
                .send(mockUserSkill1)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual("Duplicate Entry");
        });

        it("should return 400 and error when POST /api/userskill called with skill level less than 1", async () => {
            mockModel.findOne.mockResolvedValue(mockUserSkill1);

            const response = await request(app)
                .post("/api/userskill")
                .send({ ...mockUserSkill1, skillLevel: -2 })
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual("Skill level must be 1, 2, 3, 4, or 5");
        });

        it("should return 400 and error when POST /api/userskill called with skill level greater than 5", async () => {
            mockModel.findOne.mockResolvedValue(mockUserSkill1);

            const response = await request(app)
                .post("/api/userskill")
                .send({ ...mockUserSkill1, skillLevel: 6 })
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual("Skill level must be 1, 2, 3, 4, or 5");
        });
    });

    describe("PUT", () => {
        it("should return 200 and userskill when PUT /api/userskill called successfully", async () => {
            const updatedOneRecord = [1];
            mockModel.findByPk.mockResolvedValue({
                id: 1,
                skillLevel: 2,
                notes: "updates",
            });
            mockModel.update.mockResolvedValue(updatedOneRecord);

            const mockRequestBody = {
                id: 1,
                skillLevel: 2,
                notes: "updates",
            };

            const response = await request(app)
                .put("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.update).toHaveBeenLastCalledWith(
                {
                    skillLevel: 2,
                    notes: "updates",
                },
                { where: { id: mockRequestBody.id } },
            );
            expect(response.body).toEqual("User Skill updated");
        });

        it("should return 400 and error when PUT /api/userskill called without id", async () => {
            const mockRequestBody = {
                id: undefined,
                userId: 1,
                skillId: 1,
                skillLevel: 2,
                notes: "updates",
                expiryDate: "2025-02-25",
            };

            const response = await request(app)
                .put("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when PUT /api/userskill called without skillLevel", async () => {
            const mockRequestBody = {
                id: 1,
                skillLevel: undefined,
                notes: "updates",
            };

            const response = await request(app)
                .put("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when PUT /api/userskill called without notes", async () => {
            const mockRequestBody = {
                id: 1,
                skillLevel: 2,
                notes: undefined,
            };

            const response = await request(app)
                .put("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when PUT /api/userskill called with invalid id", async () => {
            const updatedZeroRecords = [0];
            const invalidId = "invalidID";

            mockModel.update.mockResolvedValue(updatedZeroRecords);
            mockModel.findByPk.mockResolvedValue(undefined);
            const mockRequestBody = {
                id: invalidId,
                skillLevel: 2,
                notes: "updates",
            };

            const response = await request(app)
                .put("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual("Id not found");
        });

        it("should return 400 and error when PUT /api/userskill called with existing details", async () => {
            const updatedZeroRecords = [0];
            mockModel.update.mockResolvedValue(updatedZeroRecords);
            mockModel.findByPk.mockResolvedValue({
                id: 1,
                skillLevel: 2,
                notes: "updates",
            });

            const response = await request(app)
                .put("/api/userskill")
                .send({
                    id: 1,
                    skillLevel: 2,
                    notes: "updates",
                })
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(
                "Unable to update User Skill - parameter values may already exist",
            );
        });

        it("should return 400 and error when PUT /api/userskill called with database error", async () => {
            mockModel.update.mockRejectedValue(mockError);
            mockModel.findByPk.mockResolvedValue({
                id: 1,
                skillLevel: 2,
                notes: "updates",
            });
            const mockRequestBody = {
                id: 1,
                skillLevel: 2,
                notes: "updates",
            };
            const response = await request(app)
                .put("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });

        it("should return 400 and error when PUT /api/userskill called with notes shorter than 5 chars", async () => {
            const mockRequestBody = {
                id: 1,
                skillLevel: 1,
                notes: "1234",
            };

            const response = await request(app)
                .put("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual(
                "Notes must contain a minimum of 5 characters and a maximum of 255 characters",
            );
        });

        it("should return 400 and error when PUT /api/userskill called with notes longer than 255 chars", async () => {
            const mockRequestBody = {
                id: 1,
                skillLevel: 1,
                notes:
                    "thisStringIsGreaterThan255CharactersthisStringIsGreaterThan255CharactersthisStringIsGreaterThan255Characters" +
                    "thisStringIsGreaterThan255CharactersthisStringIsGreaterThan255CharactersthisStringIsGreaterThan255Characters" +
                    "thisStringIsGreaterThan255CharactersthisStringIsGreaterThan255CharactersthisStringIsGreaterThan255Characters" +
                    "thisStringIsGreaterThan255CharactersthisStringIsGreaterThan255CharactersthisStringIsGreaterThan255Characters",
            };

            const response = await request(app)
                .put("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual(
                "Notes must contain a minimum of 5 characters and a maximum of 255 characters",
            );
        });

        it("should return 400 and error when PUT /api/userskill called with skill level less than 1", async () => {
            mockModel.findOne.mockResolvedValue(mockUserSkill1);
            const mockRequestBody = {
                id: 1,
                skillLevel: -2,
                notes: "Test notes",
            };
            const response = await request(app)
                .put("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual("Skill level must be 1, 2, 3, 4, or 5");
        });

        it("should return 400 and error when POST /api/userskill called with skill level greater than 5", async () => {
            mockModel.findOne.mockResolvedValue(mockUserSkill1);
            const mockRequestBody = {
                id: 1,
                skillLevel: 6,
                notes: "Test notes",
            };
            const response = await request(app)
                .put("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual("Skill level must be 1, 2, 3, 4, or 5");
        });
    });

    describe("DELETE", () => {
        it("should return 200 when DELETE /api/userskill called successfully", async () => {
            mockModel.destroy.mockResolvedValue(1);
            mockModel.findByPk.mockResolvedValue({
                id: 1,
                skillLevel: 2,
                notes: "updates",
            });
            const mockRequestBody = { id: 1 };

            const response = await request(app)
                .delete("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /text\/html; charset=utf-8/)
                .expect(200);
            expect(mockModel.destroy).toHaveBeenLastCalledWith({ where: { id: 1 } });
            expect(response.text).toEqual("User Skill deleted");
        });

        it("should return 404 and error when DELETE /api/userskill called without id", async () => {
            const response = await request(app)
                .delete("/api/userskill")
                .send({ id: undefined })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(mockModel.destroy).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 404 and error when DELETE /api/userskill called with invalid id", async () => {
            const invalidId = "invalidID";
            const mockRequestBody = { id: invalidId };

            const response = await request(app)
                .delete("/api/userskill")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(404);
            expect(response.body.error.message).toEqual("Id not found");
        });

        it("should return 404 and error when DELETE /api/userskill called with database error", async () => {
            mockModel.destroy.mockRejectedValue(mockError);
            mockModel.findByPk.mockResolvedValue({
                id: 1,
                skillLevel: 2,
                notes: "updates",
            });
            const response = await request(app)
                .delete("/api/userskill")
                .send({ id: 1 })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(response.body.error.message).toEqual(mockError.message);
        });
    });
});
