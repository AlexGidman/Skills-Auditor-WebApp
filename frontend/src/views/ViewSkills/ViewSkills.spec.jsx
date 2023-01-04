import { render, screen } from "@testing-library/react";
import { ViewSkills } from "./ViewSkills";
import { mockAdminUser, mockApiRequests, mockError } from "../../setupTests";
import userEvent from "@testing-library/user-event";
import * as ReactDom from "react-router-dom";
import { wait } from "@testing-library/user-event/dist/utils";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
    };
});

const mockCategory = {
    id: 1,
    name: "Category1",
};

const mockSkill1 = {
    id: 1,
    name: "Skill1",
    category: mockCategory,
};

const mockSkill2 = {
    id: 2,
    name: "Skill2",
    category: mockCategory,
};

describe("ViewSkills", () => {
    it("renders correctly when data successful", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser]);
        mockApiRequests.getAllSkills.mockImplementation(() =>
            Promise.resolve({ data: [mockSkill1, mockSkill2] }),
        );
        const { container } = render(
            <ReactDom.MemoryRouter>
                <ViewSkills />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "View Skills" })).toBeInTheDocument();

        expect(screen.getByRole("listbox")).toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: `${mockSkill1.name} - ${mockCategory.name}` }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: `${mockSkill2.name} - ${mockCategory.name}` }),
        ).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Edit skill" })).toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });

    it("should have Edit skill link that has no valid href if no option is selected", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser]);
        mockApiRequests.getAllSkills.mockImplementation(() =>
            Promise.resolve({ data: [mockSkill1, mockSkill2] }),
        );
        render(
            <ReactDom.MemoryRouter>
                <ViewSkills />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "View Skills" })).toBeInTheDocument();

        const options = screen.getAllByRole("option");
        options.forEach((option) => {
            expect(option).not.toBeChecked();
        });

        expect(screen.getByRole("link", { name: "Edit skill" })).toHaveAttribute(
            "href",
            "/edit/skill/undefined",
        );
    });

    it("should have Edit skill link that has a valid href if option is selected", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser]);
        mockApiRequests.getAllSkills.mockImplementation(() =>
            Promise.resolve({ data: [mockSkill1, mockSkill2] }),
        );
        render(
            <ReactDom.MemoryRouter>
                <ViewSkills />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "View Skills" })).toBeInTheDocument();

        userEvent.selectOptions(screen.getByRole("listbox"), "1");
        await wait(100);

        expect(screen.getByRole("link", { name: "Edit skill" })).toHaveAttribute(
            "href",
            `/edit/skill/${mockSkill1.id}`,
        );
    });

    it("renders correctly when error", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser]);
        mockApiRequests.getAllSkills.mockImplementation(() => Promise.reject(mockError));
        const { container } = render(
            <ReactDom.MemoryRouter>
                <ViewSkills />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("alert", { name: mockError.response.data.error.message }),
        ).toBeInTheDocument();

        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

        expect(screen.queryByRole("link", { name: "Edit skills" })).not.toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
});
