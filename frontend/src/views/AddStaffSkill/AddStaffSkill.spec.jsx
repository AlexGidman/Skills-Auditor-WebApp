import { render, screen } from "@testing-library/react";
import { AddStaffSkill } from "./AddStaffSkill";
import { mockAdminUser, mockApiRequests, mockError } from "../../setupTests";
import * as ReactDom from "react-router-dom";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
    };
});

const mockCategory = { id: "1", name: "testname1" };

const mockSkill1 = {
    id: "1",
    name: "Skill1",
    category: mockCategory,
};

const skillLevel = ["None", "Basic", "Intermediate", "High", "Expert"];

describe("AddStaffSkill", () => {
    beforeEach(() => {
        mockApiRequests.getAllDirectReports.mockImplementation(() => Promise.resolve({ data: [] }));
    });
    it("renders correctly when data successful", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        mockApiRequests.getAllSkills.mockImplementation(() =>
            Promise.resolve({ data: [mockSkill1] }),
        );
        const { container } = render(
            <ReactDom.MemoryRouter>
                <AddStaffSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Add Staff Skill" })).toBeInTheDocument();

        expect(screen.getByRole("combobox", { name: "Select a skill" })).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: "Select a skill" })).toHaveValue(mockSkill1.id);

        expect(screen.getByRole("combobox", { name: "Select a level" })).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: "Select a level" })).toHaveValue(skillLevel[0]);

        expect(screen.getByRole("textbox", { name: "Notes:" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Notes:" })).toHaveValue("");
        expect(screen.getByRole("input", { name: "Expiry date (optional):" })).toBeInTheDocument();
        expect(screen.getByRole("input", { name: "Expiry date (optional):" })).toHaveValue("");

        expect(screen.getByRole("button", { name: "Add Staff Skill" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add Staff Skill" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it("renders correctly when data retrieval fails", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        mockApiRequests.getAllSkills.mockImplementation(() => Promise.reject(mockError));
        const { container } = render(
            <ReactDom.MemoryRouter>
                <AddStaffSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("heading", { name: "Something went wrong..." }),
        ).toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });
});
