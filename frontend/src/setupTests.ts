// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import * as apiRequests from "./utility/apiRequests";
import * as reactCookie from "react-cookie";

import { MANAGER_JR, ADMIN, User } from "./utility/types";

jest.mock("uuid", () => {
    return {
        ...jest.requireActual("uuid"),
        v4: jest.fn().mockReturnValue("uuid"),
    };
});

jest.mock("react-cookie", () => {
    return {
        ...jest.requireActual("react-cookie"),
        useCookies: jest.fn(),
    };
});

export const mockApiRequests = {
    getAllCategories: jest.spyOn(apiRequests, "getAllCategories"),
    getCategory: jest.spyOn(apiRequests, "getCategory"),
    updateCategory: jest.spyOn(apiRequests, "updateCategory"),
    getUserDetails: jest.spyOn(apiRequests, "getUserDetails"),
    updateUserDetails: jest.spyOn(apiRequests, "updateUserDetails"),
    getSkill: jest.spyOn(apiRequests, "getSkill"),
    updateSkill: jest.spyOn(apiRequests, "updateSkill"),
    getAllSkills: jest.spyOn(apiRequests, "getAllSkills"),
    addUser: jest.spyOn(apiRequests, "addUser"),
    addDirectReport: jest.spyOn(apiRequests, "addDirectReport"),
    getUserFromToken: jest.spyOn(apiRequests, "getUserFromToken"),
    getAllDirectReports: jest.spyOn(apiRequests, "getAllDirectReports"),
    getAllStaffSkills: jest.spyOn(apiRequests, "getAllStaffSkills"),
    deleteUser: jest.spyOn(apiRequests, "deleteUser"),
    getStaffSkill: jest.spyOn(apiRequests, "getStaffSkill"),
    updateStaffSkill: jest.spyOn(apiRequests, "updateStaffSkill"),
    postLogin: jest.spyOn(apiRequests, "postLogin"),
    addSkill: jest.spyOn(apiRequests, "addSkill"),
    addCategory: jest.spyOn(apiRequests, "addCategory"),
    deleteStaffSkill: jest.spyOn(apiRequests, "deleteStaffSkill"),
    addUserSkill: jest.spyOn(apiRequests, "addUserSkill"),
};

export const mockAdminUser = {
    id: "1",
    firstName: "Admin",
    lastName: "User",
    email: "Admin@email.com",
    jobRole: MANAGER_JR,
    systemRole: ADMIN,
};

export const mockError = { response: { data: { error: new Error("Oops") }, status: 400 } };

beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
});

beforeEach(() => {
    jest.spyOn(reactCookie, "useCookies").mockImplementation(() => [
        { token: "Bearer token" },
        jest.fn(),
        jest.fn(),
    ]);
    // @ts-ignore
    mockApiRequests.getUserFromToken.mockImplementation(() =>
        Promise.resolve({ data: mockAdminUser }),
    );
});

afterEach(() => {
    jest.resetAllMocks();
});
