import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockAdminUser, mockApiRequests, mockApiResponse } from "../../setupTests";
import * as ReactDom from "react-router-dom";
import { EditStaffSkill } from "./EditStaffSkill";
import {
    BASIC,
    Category,
    EXPERT,
    HIGH,
    INTERMEDIATE,
    NONE,
    Skill,
    StaffSkill,
} from "../../utility/types";
import { wait } from "@testing-library/user-event/dist/utils";
import React from "react";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
        useNavigate: jest.fn(),
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

const mockStaffSkill2: StaffSkill = {
    id: "100",
    skillId: mockSkill1.id,
    skill: mockSkill1,
    skillLevel: "1",
    userId: mockAdminUser.id,
    notes: "test notes",
    expiryDate: "1973-01-01",
};

describe("EditStaffSkill", () => {
    beforeEach(() => {
        mockApiRequests.getAllDirectReports.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: [] }),
        );
    });
    it("renders correctly when data retrieval successful and skill has no expiry date", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });

        mockApiRequests.getStaffSkill.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: mockStaffSkill1 }),
        );
        const { container } = render(
            <ReactDom.MemoryRouter>
                <EditStaffSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("heading", { name: "Edit Staff Skill" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("status", { name: mockStaffSkill1.skillId.name }),
        ).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: "Select a level" })).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: "Select a level" })).toHaveValue(
            mockStaffSkill1.skillLevel,
        );
        expect(screen.getByRole("option", { name: NONE })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: BASIC })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: INTERMEDIATE })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: HIGH })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: EXPERT })).toBeInTheDocument();

        expect(screen.getByRole("textbox", { name: "Notes:" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Notes:" })).toHaveValue(mockStaffSkill1.notes);

        expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled();
        expect(container).toMatchSnapshot();
    });

    it("renders correctly when data retrieval successful and skill ahs expiry date", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });

        mockApiRequests.getStaffSkill.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: mockStaffSkill2 }),
        );
        const { container } = render(
            <ReactDom.MemoryRouter>
                <EditStaffSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("heading", { name: "Edit Staff Skill" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("status", {
                name: `${mockStaffSkill2.skill.name} (Expires 01/01/1973)`,
            }),
        ).toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });

    it("should have Save changes button that becomes enabled when form is valid and has changed", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });

        mockApiRequests.getStaffSkill.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: mockStaffSkill1 }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditStaffSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("heading", { name: "Edit Staff Skill" }),
        ).toBeInTheDocument();

        const inputChangeArray = [
            {
                change: () => userEvent.type(screen.getByRole("textbox", { name: "Notes:" }), "a"),
                undo: () =>
                    userEvent.type(screen.getByRole("textbox", { name: "Notes:" }), "{backspace}"),
            },

            {
                change: () =>
                    userEvent.selectOptions(
                        screen.getByRole("combobox", { name: "Select a level" }),
                        "2",
                    ),
                undo: () =>
                    userEvent.selectOptions(
                        screen.getByRole("combobox", { name: "Select a level" }),
                        mockStaffSkill1.skillLevel,
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

    it("should pass skill params to updateStaffSkill API when Save changes button clicked", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });

        mockApiRequests.getStaffSkill.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: mockStaffSkill1 }),
        );

        mockApiRequests.updateStaffSkill.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: "Success" }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditStaffSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("heading", { name: "Edit Staff Skill" }),
        ).toBeInTheDocument();

        expect(mockApiRequests.updateStaffSkill).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "Notes:" }), "a");
        userEvent.click(screen.getByRole("button", { name: "Save changes" }));
        expect(mockApiRequests.updateStaffSkill).toHaveBeenCalled();
        expect(mockApiRequests.updateStaffSkill).toHaveBeenLastCalledWith(
            { headers: { authorization: "Bearer token" } },
            mockStaffSkill1.id,
            mockStaffSkill1.skillLevel,
            mockStaffSkill1.notes + "a",
        );
    });

    it("should redirect to previous page when save changes button clicked and update successful", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });

        mockApiRequests.getStaffSkill.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: mockStaffSkill1 }),
        );

        mockApiRequests.updateStaffSkill.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: "Success" }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditStaffSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("heading", { name: "Edit Staff Skill" }),
        ).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "Notes:" }), "a");
        userEvent.click(screen.getByRole("button", { name: "Save changes" }));
        await wait(100);
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(-1);
    });

    it("should redirect to previous page when save changes button clicked and update fails", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });

        mockApiRequests.getStaffSkill.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: mockStaffSkill1 }),
        );

        mockApiRequests.updateStaffSkill.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: "Success" }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditStaffSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("heading", { name: "Edit Staff Skill" }),
        ).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "Notes:" }), "a");
        userEvent.click(screen.getByRole("button", { name: "Save changes" }));
        await wait(100);
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(-1);
    });

    it("redirects to previous page on click of Cancel button", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);

        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });

        mockApiRequests.getStaffSkill.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: mockStaffSkill1 }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditStaffSkill />
            </ReactDom.MemoryRouter>,
        );

        expect(await screen.findByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();

        userEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(-1);
    });
});
