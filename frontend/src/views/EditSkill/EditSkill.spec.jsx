import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockAdminUser, mockApiRequests, mockError } from "../../setupTests";
import * as ReactDom from "react-router-dom";
import { SENIOR_DEVELOPER, STAFF_USER } from "../../utility/types";
import { wait } from "@testing-library/user-event/dist/utils";
import { EditSkill } from "./EditSkill";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
        useNavigate: jest.fn(),
    };
});

const mockCategory1 = {
    id: "1",
    name: "Category1",
};

const mockCategory2 = {
    id: "2",
    name: "Category2",
};

const mockSkill1 = {
    id: "1",
    name: "Skill1",
    category: mockCategory1,
};

describe("EditSkill", () => {
    it("renders correctly when data retrieval successful", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        mockApiRequests.getSkill.mockImplementation(() => Promise.resolve({ data: mockSkill1 }));
        mockApiRequests.getAllCategories.mockImplementation(() =>
            Promise.resolve({ data: [mockCategory1, mockCategory2] }),
        );
        const { container } = render(
            <ReactDom.MemoryRouter>
                <EditSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Edit Skill" })).toBeInTheDocument();

        expect(screen.getByRole("textbox", { name: "Skill description:" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Skill description:" })).toHaveValue(
            mockSkill1.name,
        );

        expect(await screen.findByRole("combobox", { name: "Skill category" })).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: "Skill category" })).toHaveValue(
            mockSkill1.category.id,
        );

        expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled();
        expect(container).toMatchSnapshot();
    });

    it("should have Save changes button that becomes enabled when form has changed", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        mockApiRequests.getSkill.mockImplementation(() => Promise.resolve({ data: mockSkill1 }));
        mockApiRequests.getAllCategories.mockImplementation(() =>
            Promise.resolve({ data: [mockCategory1, mockCategory2] }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Edit Skill" })).toBeInTheDocument();
        expect(await screen.findByRole("combobox", { name: "Skill category" })).toBeInTheDocument();

        const inputChangeArray = [
            {
                change: () =>
                    userEvent.type(
                        screen.getByRole("textbox", { name: "Skill description:" }),
                        "a",
                    ),
                undo: () =>
                    userEvent.type(
                        screen.getByRole("textbox", { name: "Skill description:" }),
                        "{backspace}",
                    ),
            },

            {
                change: () =>
                    userEvent.selectOptions(
                        screen.getByRole("combobox", { name: "Skill category" }),
                        mockCategory2.id,
                    ),
                undo: () =>
                    userEvent.selectOptions(
                        screen.getByRole("combobox", { name: "Skill category" }),
                        mockSkill1.category.id,
                    ),
            },
        ];
        for (let changeInputFunc of inputChangeArray) {
            expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
            changeInputFunc.change();
            expect(screen.getByRole("button", { name: "Save changes" })).not.toBeDisabled();
            changeInputFunc.undo();

            expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
        }
    });

    it("should have pass user params to updateDetails API when Save changes button clicked", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        mockApiRequests.getSkill.mockImplementation(() => Promise.resolve({ data: mockSkill1 }));
        mockApiRequests.getAllCategories.mockImplementation(() =>
            Promise.resolve({ data: [mockCategory1, mockCategory2] }),
        );
        mockApiRequests.updateSkill.mockImplementation(() => Promise.resolve("success"));
        render(
            <ReactDom.MemoryRouter>
                <EditSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Edit Skill" })).toBeInTheDocument();
        expect(await screen.findByRole("combobox", { name: "Skill category" })).toBeInTheDocument();

        expect(mockApiRequests.updateSkill).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "Skill description:" }), "a");
        userEvent.click(screen.getByRole("button", { name: "Save changes" }));
        expect(mockApiRequests.updateSkill).toHaveBeenCalled();
    });

    it("should redirect to previous page when save changes button clicked and update successful", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        mockApiRequests.getSkill.mockImplementation(() => Promise.resolve({ data: mockSkill1 }));
        mockApiRequests.getAllCategories.mockImplementation(() =>
            Promise.resolve({ data: [mockCategory1, mockCategory2] }),
        );
        mockApiRequests.updateSkill.mockImplementation(() => Promise.resolve("success"));
        render(
            <ReactDom.MemoryRouter>
                <EditSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Edit Skill" })).toBeInTheDocument();
        expect(await screen.findByRole("combobox", { name: "Skill category" })).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "Skill description:" }), "a");
        userEvent.click(screen.getByRole("button", { name: "Save changes" }));
        await wait(100);
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(-1);
    });

    it("should redirect to previous page when save changes button clicked and update fails", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        mockApiRequests.getSkill.mockImplementation(() => Promise.resolve({ data: mockSkill1 }));
        mockApiRequests.getAllCategories.mockImplementation(() =>
            Promise.resolve({ data: [mockCategory1, mockCategory2] }),
        );
        mockApiRequests.updateSkill.mockImplementation(() => Promise.reject(mockError));
        render(
            <ReactDom.MemoryRouter>
                <EditSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Edit Skill" })).toBeInTheDocument();
        expect(await screen.findByRole("combobox", { name: "Skill category" })).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "Skill description:" }), "a");
        userEvent.click(screen.getByRole("button", { name: "Save changes" }));
        await wait(100);
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(-1);
    });

    it("redirects to previous page on click of Cancel button", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        mockApiRequests.getSkill.mockImplementation(() => Promise.resolve({ data: mockSkill1 }));
        mockApiRequests.getAllCategories.mockImplementation(() =>
            Promise.resolve({ data: [mockCategory1, mockCategory2] }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Edit Skill" })).toBeInTheDocument();
        expect(await screen.findByRole("combobox", { name: "Skill category" })).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();

        userEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(-1);
    });
});
