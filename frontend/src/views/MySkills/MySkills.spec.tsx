import { render, screen } from "@testing-library/react";
import { MySkills } from "./MySkills";
import { mockAdminUser, mockApiRequests, mockApiResponse, mockError } from "../../setupTests";
import * as ReactDom from "react-router-dom";
import React from "react";
import { Category, Skill, StaffSkill } from "../../utility/types";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
    };
});

const mockCategory: Category = { id: "1", name: "testname1" };

const mockSkill1: Skill = {
    id: "1",
    name: "Skill1",
    category: mockCategory,
    categoryId: mockCategory.id,
};

const mockStaffSkill1: StaffSkill = {
    id: "100",
    skillId: mockSkill1.id,
    skill: mockSkill1,
    skillLevel: "1",
    userId: mockAdminUser.id,
    notes: "test notes",
    expiryDate: "0000-00-00",
};

describe("MySkills", () => {
    it("renders correctly when data successful", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });

        mockApiRequests.getAllStaffSkills.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: [mockStaffSkill1] }),
        );

        mockApiRequests.deleteStaffSkill.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: "Success" }),
        );
        const { container } = render(
            <ReactDom.MemoryRouter>
                <MySkills />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "My Skills" })).toBeInTheDocument();

        expect(screen.getByRole("listbox", { name: "Select a user skill" })).toBeInTheDocument();
        expect(
            screen.getByRole("option", {
                name: `${mockStaffSkill1.skill.name} - ${mockStaffSkill1.skill.category.name}`,
            }),
        ).toBeInTheDocument();

        expect(screen.getAllByRole("table").length).toBe(2);
        expect(screen.getByRole("columnheader", { name: "Skill Level:" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: "None" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Expiry Date:" })).toBeInTheDocument();

        expect(screen.getByRole("cell", { name: mockStaffSkill1.notes })).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
        expect(screen.getByRole("link", { name: "Add Skill" })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it("renders correctly when data retrieval fails", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });
        mockApiRequests.getAllStaffSkills.mockImplementation(() => Promise.reject(mockError));
        mockApiRequests.deleteStaffSkill.mockImplementation(() => Promise.reject(mockError));
        const { container } = render(
            <ReactDom.MemoryRouter>
                <MySkills />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "My Skills" })).toBeInTheDocument();

        expect(
            screen.queryByRole("listbox", { name: "Select a user skill" }),
        ).not.toBeInTheDocument();

        expect(screen.queryByRole("table")).not.toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
        expect(screen.getByRole("link", { name: "Add Skill" })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
});
