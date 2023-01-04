const request = require("supertest");

const app = require("../../app");
const { mockModel, mockError, mockArgon2, mockUtilities } = require("./testing");

describe("/login", () => {
    it("should return 200 and id + password of user with passed email when called successfully", async () => {
        const mockResponse = { id: "1", password: "testPassword" };
        mockModel.findOne.mockResolvedValue(mockResponse);
        mockArgon2.hash.mockImplementation((password) => password);
        mockArgon2.verify.mockResolvedValue(true);
        mockUtilities.generateAccessToken.mockReturnValue("JWT_TOKEN");

        const mockRequestBody = {
            email: "test1@email.com",
            password: "testPassword",
        };

        const response = await request(app)
            .post("/api/login")
            .send(mockRequestBody)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(mockModel.findOne).toHaveBeenCalled();
        expect(response.body).toEqual({ id: mockResponse.id, token: "Bearer JWT_TOKEN" });
    });

    it("should return 400 and error when POST /login is called with an incorrect password", async () => {
        const mockResponse = { id: "1", password: "testPassword" };
        mockModel.findOne.mockResolvedValue(mockResponse);
        mockArgon2.hash.mockImplementation((password) => password);
        mockArgon2.verify.mockResolvedValue(false);

        const mockRequestBody = {
            email: "test1@email.com",
            password: "incorrectPassword",
        };

        const response = await request(app)
            .post("/api/login")
            .send(mockRequestBody)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(mockModel.findOne).toHaveBeenCalled();
        expect(response.body.error.message).toEqual("Incorrect password");
    });

    it("should return 400 and error when POST /login is called with invalid email", async () => {
        mockModel.findOne.mockRejectedValue(mockError);

        const mockRequestBody = {
            email: "incorrectEmail",
            password: "testPassword",
        };

        const response = await request(app)
            .post("/api/login")
            .send(mockRequestBody)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(mockModel.findOne).toHaveBeenCalled();
        expect(response.body.error.message).toEqual(mockError.message);
    });
});
