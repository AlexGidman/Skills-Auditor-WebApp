import { render, screen } from "@testing-library/react";
import { MySkills } from "./MySkills";
import { mockAdminUser, mockApiRequests, mockError } from "../../setupTests";
import { convertSkillLevelName } from "../../utility/helper";
import * as ReactDom from "react-router-dom";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
    };
});

const mockCategory = { id: "1", name: "testname1" };

const mockSkill1 = {
    id: 1,
    name: "Skill1",
    category: mockCategory,
};

const mockStaffSkill1 = {
    id: "100",
    skillID: mockSkill1,
    skill_level: "1",
    user_id: mockAdminUser.id,
    notes: "test notes",
    expiry_date: null,
};

describe("MySkills", () => {
    it("renders correctly when data successful", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        mockApiRequests.getAllStaffSkills.mockImplementation(() =>
            Promise.resolve({ data: [mockStaffSkill1] }),
        );
        mockApiRequests.deleteStaffSkill.mockImplementation(() =>
            Promise.resolve({ data: "Success" }),
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
                name: `${mockStaffSkill1.skillID.name} - ${mockStaffSkill1.skillID.category.name}`,
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
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
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
