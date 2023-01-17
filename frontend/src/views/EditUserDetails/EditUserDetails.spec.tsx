import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockAdminUser, mockApiRequests, mockError } from "../../setupTests";
import * as ReactDom from "react-router-dom";
import { EditUserDetails } from "./EditUserDetails";
import { ADMIN, MANAGER_JR, SENIOR_DEVELOPER, STAFF_USER, User } from "../../utility/types";
import { wait } from "@testing-library/user-event/dist/utils";
import React from "react";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
        useNavigate: jest.fn(),
    };
});

const mockUser: User = {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "John@email.com",
    jobRole: MANAGER_JR,
    systemRole: ADMIN,
};

describe("EditUserDetails", () => {
    beforeEach(() => {
        // @ts-ignore TODO: fix this
        mockApiRequests.getAllDirectReports.mockImplementation(() => Promise.resolve({ data: [] }));
    });
    it("renders correctly when data retrieval successful", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getUserDetails.mockImplementation(() =>
            Promise.resolve({ data: mockUser }),
        );
        const { container } = render(
            <ReactDom.MemoryRouter>
                <EditUserDetails />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("heading", { name: "Edit User Details" }),
        ).toBeInTheDocument();

        expect(screen.getByRole("textbox", { name: "First name:" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "First name:" })).toHaveValue(
            mockUser.firstName,
        );
        expect(screen.getByRole("textbox", { name: "Last name:" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Last name:" })).toHaveValue(mockUser.lastName);
        expect(screen.getByRole("textbox", { name: "Email:" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Email:" })).toHaveValue(mockUser.email);
        expect(screen.getByLabelText(/New password/)).toBeInTheDocument(); // no accessible role for passoword inputs

        expect(screen.getByRole("combobox", { name: "Job role" })).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: "Job role" })).toHaveValue(mockUser.jobRole);
        expect(screen.getByRole("combobox", { name: "System role" })).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: "System role" })).toHaveValue(
            mockUser.systemRole,
        );

        expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled();
        expect(container).toMatchSnapshot();
    });

    it("should have Save changes button that becomes enabled when form is valid and has changed", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getUserDetails.mockImplementation(() =>
            Promise.resolve({ data: mockUser }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditUserDetails />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("heading", { name: "Edit User Details" }),
        ).toBeInTheDocument();
        const inputChangeArray = [
            {
                change: () =>
                    userEvent.type(screen.getByRole("textbox", { name: "First name:" }), "a"),
                undo: () =>
                    userEvent.type(
                        screen.getByRole("textbox", { name: "First name:" }),
                        "{backspace}",
                    ),
            },
            {
                change: () =>
                    userEvent.type(screen.getByRole("textbox", { name: "Last name:" }), "a"),
                undo: () =>
                    userEvent.type(
                        screen.getByRole("textbox", { name: "Last name:" }),
                        "{backspace}",
                    ),
            },
            {
                change: () => userEvent.type(screen.getByRole("textbox", { name: "Email:" }), "a"),
                undo: () =>
                    userEvent.type(screen.getByRole("textbox", { name: "Email:" }), "{backspace}"),
            },
            {
                change: () => userEvent.type(screen.getByLabelText(/New password/), "aaaaaaaaaa"), // min 10 chars
                undo: () => userEvent.clear(screen.getByLabelText(/New password/)),
            },
            {
                change: () =>
                    userEvent.selectOptions(
                        screen.getByRole("combobox", { name: "Job role" }),
                        SENIOR_DEVELOPER,
                    ),
                undo: () =>
                    userEvent.selectOptions(
                        screen.getByRole("combobox", { name: "Job role" }),
                        mockUser.jobRole,
                    ),
            },
            {
                change: () =>
                    userEvent.selectOptions(
                        screen.getByRole("combobox", { name: "System role" }),
                        STAFF_USER,
                    ),
                undo: () =>
                    userEvent.selectOptions(
                        screen.getByRole("combobox", { name: "System role" }),
                        mockUser.systemRole,
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

    it("should have Save changes button that becomes disabled when form is invalid", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getUserDetails.mockImplementation(() =>
            Promise.resolve({ data: mockUser }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditUserDetails />
            </ReactDom.MemoryRouter>,
        );
        const inputChangeArray = [
            {
                change: () => userEvent.clear(screen.getByRole("textbox", { name: "First name:" })),
                undo: () =>
                    userEvent.type(
                        screen.getByRole("textbox", { name: "First name:" }),
                        mockUser.firstName,
                    ),
            },
            {
                change: () => userEvent.clear(screen.getByRole("textbox", { name: "Last name:" })),
                undo: () =>
                    userEvent.type(
                        screen.getByRole("textbox", { name: "Last name:" }),
                        mockUser.lastName,
                    ),
            },
            {
                change: () => userEvent.clear(screen.getByRole("textbox", { name: "Email:" })),
                undo: () =>
                    userEvent.type(screen.getByRole("textbox", { name: "Email:" }), mockUser.email),
            },
            {
                change: () => userEvent.type(screen.getByLabelText(/New password/), "aaaaaaaaa"), // 9 chars
                undo: () => userEvent.clear(screen.getByLabelText(/New password/)),
            },
        ];
        for (let changeInputFunc of inputChangeArray) {
            expect(
                await screen.findByRole("heading", { name: "Edit User Details" }),
            ).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
            changeInputFunc.change();
            expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
            changeInputFunc.undo();
        }
    });

    it("should have pass user params to updateDetails API when Save changes button clicked", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getUserDetails.mockImplementation(() =>
            Promise.resolve({ data: mockUser }),
        );
        // @ts-ignore TODO: fix this
        mockApiRequests.updateUserDetails.mockImplementation(() =>
            Promise.resolve({ data: "Success" }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditUserDetails />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("heading", { name: "Edit User Details" }),
        ).toBeInTheDocument();

        expect(mockApiRequests.updateUserDetails).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "First name:" }), "a");
        userEvent.click(screen.getByRole("button", { name: "Save changes" }));
        expect(mockApiRequests.updateUserDetails).toHaveBeenCalled();
        expect(mockApiRequests.updateUserDetails).toHaveBeenLastCalledWith(
            { headers: { authorization: "Bearer token" } },
            1,
            "Johna",
            "Smith",
            "John@email.com",
            "",
            MANAGER_JR,
            ADMIN,
        );
    });

    it("should redirect to previous page when save changes button clicked and update successful", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getUserDetails.mockImplementation(() =>
            Promise.resolve({ data: mockUser }),
        );
        // @ts-ignore TODO: fix this
        mockApiRequests.updateUserDetails.mockImplementation(() =>
            Promise.resolve({ data: "Success" }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditUserDetails />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("heading", { name: "Edit User Details" }),
        ).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "First name:" }), "a");
        userEvent.click(screen.getByRole("button", { name: "Save changes" }));
        await wait(100);
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(-1);
    });

    it("should redirect to previous page when save changes button clicked and update fails", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getUserDetails.mockImplementation(() =>
            Promise.resolve({ data: mockUser }),
        );
        mockApiRequests.updateUserDetails.mockImplementation(() => Promise.reject(mockError));
        render(
            <ReactDom.MemoryRouter>
                <EditUserDetails />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("heading", { name: "Edit User Details" }),
        ).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "First name:" }), "a");
        userEvent.click(screen.getByRole("button", { name: "Save changes" }));
        await wait(100);
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(-1);
    });

    it("redirects to previous page on click of Cancel button", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);

        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getUserDetails.mockImplementation(() =>
            Promise.resolve({ data: mockUser }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditUserDetails />
            </ReactDom.MemoryRouter>,
        );

        expect(await screen.findByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();

        userEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(-1);
    });
});
