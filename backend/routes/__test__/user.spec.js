const request = require("supertest");

const app = require("../../app");
const { mockModel, mockError, mockArgon2 } = require("./testing");

let mockUser1;
let mockUser2;

beforeEach(() => {
    mockUser1 = {
        id: "1",
        firstName: "testfirstName1",
        lastName: "testlastName1",
        email: "test1@email.com",
        password: "testPassword",
        systemRole: "Manager",
        jobRole: "Manager",
    };
    mockUser2 = {
        id: "2",
        firstName: "testfirstName2",
        lastName: "testlastName2",
        email: "test2@email.com",
        password: "testPassword",
        systemRole: "StaffUser",
        jobRole: "Senior Developer",
    };
});

describe("/api/user", () => {
    describe("GET all", () => {
        it("should return 200 and users when GET /api/user called successfully", async () => {
            const mockUsers = [mockUser1, mockUser2];
            mockModel.findAll.mockResolvedValue(mockUsers);

            const response = await request(app)
                .get("/api/user")
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.findAll).toHaveBeenCalled();
            expect(response.body).toEqual([
                { ...mockUser1, password: undefined },
                { ...mockUser2, password: undefined },
            ]);
        });

        it("should return 400 and error when GET /api/user called with database error", async () => {
            mockModel.findAll.mockRejectedValue(mockError);

            const response = await request(app)
                .get("/api/user")
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });
    });

    describe("GET by id", () => {
        it("should return 200 and user when GET /api/user/:id called successfully", async () => {
            mockModel.findByPk.mockResolvedValue(mockUser1);

            const response = await request(app)
                .get(`/api/user/${mockUser1.id}`)
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.findByPk).toHaveBeenLastCalledWith(mockUser1.id);
            expect(response.body).toEqual({ ...mockUser1, password: undefined });
        });

        it("should return 400 and error when GET /api/user/:id called with invalid id", async () => {
            const invalidId = "invalidID";
            mockModel.findByPk.mockResolvedValue(undefined);

            const response = await request(app)
                .get(`/api/user/${invalidId}`)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.findByPk).toHaveBeenLastCalledWith(invalidId);
            expect(response.body.error.message).toEqual(`Unable to find User with id ${invalidId}`);
        });

        it("should return 400 and error when GET /api/user/:id called with database error", async () => {
            mockModel.findByPk.mockRejectedValue(mockError);

            const response = await request(app)
                .get("/api/user/1")
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });
    });

    describe("POST", () => {
        it("should return 201 and user when POST /api/user called successfully", async () => {
            mockArgon2.hash.mockImplementation((password) => password);
            mockModel.create.mockResolvedValue(mockUser1);
            const mockRequestBody = {
                firstName: mockUser1.firstName,
                lastName: mockUser1.lastName,
                email: mockUser1.email,
                password: mockUser1.password,
                systemRole: mockUser1.systemRole,
                jobRole: mockUser1.jobRole,
            };

            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(201);
            expect(mockModel.create).toHaveBeenLastCalledWith(mockRequestBody);
            expect(response.body).toEqual({ id: "1", message: "User created" });
        });

        it("should return 400 and error when POST /api/user called without firstName", async () => {
            const mockRequestBody = {
                lastName: mockUser1.lastName,
                email: mockUser1.email,
                password: mockUser1.password,
                systemRole: mockUser1.systemRole,
                jobRole: mockUser1.jobRole,
            };

            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/user called without lastName", async () => {
            const mockRequestBody = {
                firstName: mockUser1.firstName,
                email: mockUser1.email,
                password: mockUser1.password,
                systemRole: mockUser1.systemRole,
                jobRole: mockUser1.jobRole,
            };

            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/user called without email", async () => {
            const mockRequestBody = {
                firstName: mockUser1.firstName,
                lastName: mockUser1.lastName,
                password: mockUser1.password,
                systemRole: mockUser1.systemRole,
                jobRole: mockUser1.jobRole,
            };

            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/user called without password", async () => {
            const mockRequestBody = {
                firstName: mockUser1.firstName,
                lastName: mockUser1.lastName,
                email: mockUser1.email,
                systemRole: mockUser1.systemRole,
                jobRole: mockUser1.jobRole,
            };

            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/user called without system role", async () => {
            const mockRequestBody = {
                firstName: mockUser1.firstName,
                lastName: mockUser1.lastName,
                email: mockUser1.email,
                password: mockUser1.password,
                jobRole: mockUser1.jobRole,
            };

            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/user called with invalid system role", async () => {
            const mockRequestBody = {
                firstName: mockUser1.firstName,
                lastName: mockUser1.lastName,
                email: mockUser1.email,
                password: mockUser1.password,
                systemRole: "INVALID SYSTEM ROLE",
                jobRole: mockUser1.jobRole,
            };

            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual(
                "Not a valid entry for System Role: Options are Admin, Manager, StaffUser",
            );
        });

        it("should return 400 and error when POST /api/user called without job role", async () => {
            const mockRequestBody = {
                firstName: mockUser1.firstName,
                lastName: mockUser1.lastName,
                email: mockUser1.email,
                password: mockUser1.password,
                systemRole: mockUser1.systemRole,
            };

            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when POST /api/user called with invalid job role", async () => {
            const mockRequestBody = {
                firstName: mockUser1.firstName,
                lastName: mockUser1.lastName,
                email: mockUser1.email,
                password: mockUser1.password,
                systemRole: mockUser1.jobRole,
                jobRole: "INVALID JOB ROLE",
            };

            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual(
                "Not a valid entry for Job Role: Options are Manager, Senior Developer, Mid-Level Developer",
            );
        });

        it("should return 400 and error when POST /api/user called with database error", async () => {
            mockArgon2.hash.mockImplementation((password) => password);
            mockModel.create.mockRejectedValue(mockError);

            const mockRequestBody = {
                firstName: mockUser1.firstName,
                lastName: mockUser1.lastName,
                email: mockUser1.email,
                password: mockUser1.password,
                systemRole: mockUser1.systemRole,
                jobRole: mockUser1.jobRole,
            };

            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });

        it("should return 400 and error when POST /api/user called when email already exists", async () => {
            mockArgon2.hash.mockImplementation((password) => password);
            mockModel.findOne.mockResolvedValue(mockUser1);

            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: "updatedpass",
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };
            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual("Duplicate Entry");
        });

        it("should return 400 and error when POST /api/user called with password shorter than 10 chars", async () => {
            const mockRequestBody = {
                firstName: mockUser1.firstName,
                lastName: mockUser1.lastName,
                email: mockUser1.email,
                password: "123456789",
                systemRole: mockUser1.systemRole,
                jobRole: mockUser1.jobRole,
            };

            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual(
                "Password must contain a minimum of 10 characters and a maximum of 16 characters",
            );
        });

        it("should return 400 and error when POST /api/user called with password longer than 16 chars", async () => {
            const mockRequestBody = {
                firstName: mockUser1.firstName,
                lastName: mockUser1.lastName,
                email: mockUser1.email,
                password: "ThisPasswordIsTooLong",
                systemRole: mockUser1.systemRole,
                jobRole: mockUser1.jobRole,
            };

            const response = await request(app)
                .post("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual(
                "Password must contain a minimum of 10 characters and a maximum of 16 characters",
            );
        });
    });

    describe("PUT", () => {
        beforeEach(() => {
            mockModel.findByPk.mockResolvedValue(mockUser1);
        });
        it("should return 200 and user when PUT /api/user called successfully", async () => {
            mockArgon2.hash.mockImplementation((password) => password);
            const updatedOneRecord = [1];
            mockModel.update.mockResolvedValue(updatedOneRecord);
            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: "updatedpass",
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.update).toHaveBeenLastCalledWith(
                {
                    firstName: mockRequestBody.firstName,
                    lastName: mockRequestBody.lastName,
                    email: mockRequestBody.email,
                    password: mockRequestBody.password,
                    systemRole: mockRequestBody.systemRole,
                    jobRole: mockRequestBody.jobRole,
                },
                { where: { id: mockRequestBody.id } },
            );
            expect(mockModel.update).toHaveBeenCalled();
            expect(response.body).toEqual("User updated");
            expect(mockArgon2.hash).toHaveBeenLastCalledWith("updatedpass", expect.anything());
        });

        it("should return 400 and error when PUT /api/user called without id", async () => {
            const mockRequestBody = {
                id: undefined,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: "updatedpass",
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when PUT /api/user called without firstName", async () => {
            const mockRequestBody = {
                id: mockUser1.id,
                firstName: undefined,
                lastName: "updated",
                email: "updated",
                password: "updatedpass",
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when PUT /api/user called without lastName", async () => {
            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: undefined,
                email: "updated",
                password: "updatedpass",
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when PUT /api/user called without email", async () => {
            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: undefined,
                password: "updatedpass",
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when PUT /api/user called without password and user does not exist", async () => {
            mockModel.findByPk.mockResolvedValue(undefined);
            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: undefined,
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Unable to find User with id 1");
        });

        it("should return 200 when PUT /api/user called without password and user DOES exist", async () => {
            const updatedOneRecord = [1];
            mockModel.update.mockResolvedValue(updatedOneRecord);
            mockModel.findByPk.mockResolvedValue(mockUser1);
            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: undefined,
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(200);
            expect(mockModel.update).toHaveBeenCalled();
            expect(response.body).toEqual("User updated");
            expect(mockArgon2.hash).not.toHaveBeenCalled();
        });

        it("should return 400 and error when PUT /api/user called without system role", async () => {
            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: "updatedpass",
                systemRole: undefined,
                jobRole: "Senior Developer",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when PUT /api/user called with invalid system role", async () => {
            mockArgon2.hash.mockImplementation((password) => password);

            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: "updatedpass",
                systemRole: "INVALID SYSTEM ROLE",
                jobRole: "Senior Developer",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual(
                "Not a valid entry for System Role: Options are Admin, Manager, StaffUser",
            );
        });

        it("should return 400 and error when PUT /api/user called without job role", async () => {
            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: "updatedpass",
                systemRole: "StaffUser",
                jobRole: undefined,
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.update).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 400 and error when PUT /api/user called with invalid job role", async () => {
            mockArgon2.hash.mockImplementation((password) => password);

            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: "updatedpass",
                systemRole: "Admin",
                jobRole: "INVALID JOB ROLE",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(mockModel.create).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual(
                "Not a valid entry for Job Role: Options are Manager, Senior Developer, Mid-Level Developer",
            );
        });

        it("should return 400 and error when PUT /api/user called with invalid id", async () => {
            mockArgon2.hash.mockImplementation((password) => password);
            const updatedZeroRecords = [0];
            const invalidId = "invalidID";
            mockModel.update.mockResolvedValue(updatedZeroRecords);
            mockModel.findByPk.mockResolvedValue(undefined);
            const mockRequestBody = {
                id: invalidId,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: "updatedpass",
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(`Unable to find User with id ${invalidId}`);
        });

        it("should return 400 and error when PUT /api/user called with existing details", async () => {
            mockArgon2.hash.mockImplementation((password) => password);
            const updatedZeroRecords = [0];
            mockModel.update.mockResolvedValue(updatedZeroRecords);
            mockModel.findByPk.mockResolvedValue(mockUser1);

            const response = await request(app)
                .put("/api/user")
                .send({ ...mockUser1, password: undefined })
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(
                "Unable to update User - parameter values may already exist",
            );
        });

        it("should return 400 and error when PUT /api/user called with database error", async () => {
            mockArgon2.hash.mockImplementation((password) => password);
            mockModel.update.mockRejectedValue(mockError);

            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: "updatedpass",
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };
            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(mockError.message);
        });

        it("should return 400 and error when PUT /api/user called when email already exists", async () => {
            mockArgon2.hash.mockImplementation((password) => password);
            mockModel.findOne.mockResolvedValue(mockUser1);

            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: "updatedpass",
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };
            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual("Duplicate Entry");
        });

        it("should return 400 and error when PUT /api/user called withpassword shorter than 10 chars", async () => {
            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: "123456789",
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(
                "Password must contain a minimum of 10 characters and a maximum of 16 characters",
            );
        });

        it("should return 400 and error when PUT /api/user called withpassword longer than 16 chars", async () => {
            const mockRequestBody = {
                id: mockUser1.id,
                firstName: "updated",
                lastName: "updated",
                email: "updated",
                password: "ThisPasswordIsTooLong",
                systemRole: "StaffUser",
                jobRole: "Senior Developer",
            };

            const response = await request(app)
                .put("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.error.message).toEqual(
                "Password must contain a minimum of 10 characters and a maximum of 16 characters",
            );
        });
    });

    describe("DELETE", () => {
        it("should return 200 when DELETE /api/user called successfully", async () => {
            mockModel.destroy.mockResolvedValue(1);
            const mockRequestBody = { id: mockUser1.id };

            const response = await request(app)
                .delete("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /text\/html; charset=utf-8/)
                .expect(200);
            expect(mockModel.destroy).toHaveBeenLastCalledWith({ where: { id: mockUser1.id } });
            expect(response.text).toEqual("User deleted");
        });

        it("should return 404 and error when DELETE /api/user called without id", async () => {
            const response = await request(app)
                .delete("/api/user")
                .send({ id: undefined })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(mockModel.destroy).not.toHaveBeenCalled();
            expect(response.body.error.message).toEqual("Essential fields missing");
        });

        it("should return 404 and error when DELETE /api/user called with invalid id", async () => {
            mockModel.destroy.mockResolvedValue(0);
            const invalidId = "invalidID";
            const mockRequestBody = { id: invalidId };

            const response = await request(app)
                .delete("/api/user")
                .send(mockRequestBody)
                .expect("Content-Type", /json/)
                .expect(404);
            expect(mockModel.destroy).toHaveBeenLastCalledWith({ where: { id: invalidId } });
            expect(response.body.error.message).toEqual("Id not found");
        });

        it("should return 404 and error when DELETE /api/user called with database error", async () => {
            mockModel.destroy.mockRejectedValue(mockError);

            const response = await request(app)
                .delete("/api/user")
                .send({ id: mockUser1.id })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(response.body.error.message).toEqual(mockError.message);
        });
    });
});
