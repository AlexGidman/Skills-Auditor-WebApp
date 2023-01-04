const mockError = new Error("Test Error!");

const mockModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
    belongsTo: jest.fn(),
};

const mockSequelize = {
    authenticate: jest.fn().mockResolvedValue(true),
    define: jest.fn().mockReturnValue(mockModel),
};

jest.mock("sequelize", () => {
    return function Sequelize() {
        return { ...mockSequelize };
    };
});

jest.mock("argon2", () => {
    return {
        hash: jest.fn(),
        verify: jest.fn(),
    };
});

jest.mock("../../utilities/utility", () => {
    return {
        ...jest.requireActual("../../utilities/utility"),
        checkToken: jest.fn(),
        generateAccessToken: jest.fn(),
        actionIsPermittedBySystemRole: jest.fn(),
        isUserOrDirectReportOfUser: jest.fn(),
    };
});

const mockArgon2 = require("argon2");
const mockUtilities = require("../../utilities/utility");

beforeEach(() => {
    mockUtilities.checkToken.mockImplementation((req, res, next) => {
        return next();
    });
    mockUtilities.actionIsPermittedBySystemRole.mockImplementation((req, res) => {
        return Promise.resolve(true);
    });
    mockUtilities.isUserOrDirectReportOfUser.mockImplementation((req, res) => {
        return Promise.resolve(true);
    });
    console.log = jest.fn();
    console.warn = jest.fn();
});

afterEach(() => {
    jest.resetAllMocks();
});

module.exports = { mockModel, mockError, mockArgon2, mockUtilities };
