import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockAdminUser, mockApiRequests, mockApiResponse, mockError } from "../../setupTests";
import * as ReactDom from "react-router-dom";
import { AddStaff } from "./AddStaff";
import { MIDLEVEL_DEVELOPER, STAFF_USER } from "../../utility/types";
import { wait } from "@testing-library/user-event/dist/utils";
import React from "react";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
        useNavigate: jest.fn(),
    };
});

describe("AddStaff", () => {
    beforeEach(() => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => jest.fn());
    });
    it("renders correctly", async () => {
        const { container } = render(
            <ReactDom.MemoryRouter>
                <AddStaff />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Add Staff" })).toBeInTheDocument();

        expect(screen.getByRole("textbox", { name: "First name:" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "First name:" })).toHaveValue("");
        expect(screen.getByRole("textbox", { name: "Last name:" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Last name:" })).toHaveValue("");
        expect(screen.getByRole("textbox", { name: "Email:" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Email:" })).toHaveValue("");
        expect(screen.getByLabelText(/Password/)).toBeInTheDocument(); // no accessible role for passoword inputs

        expect(screen.getByRole("combobox", { name: "Job role" })).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: "Job role" })).toHaveValue(MIDLEVEL_DEVELOPER);
        expect(screen.getByRole("combobox", { name: "System role" })).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: "System role" })).toHaveValue(STAFF_USER);

        expect(screen.getByRole("button", { name: "Add Staff" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add Staff" })).toBeDisabled();

        expect(container).toMatchSnapshot();
    });

    it("should have Add Staff button that becomes enabled when form is valid and has changed", async () => {
        render(
            <ReactDom.MemoryRouter>
                <AddStaff />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Add Staff" })).toBeInTheDocument();
        const inputChangeArray = [
            {
                change: () =>
                    userEvent.type(screen.getByRole("textbox", { name: "First name:" }), "a"),
                undo: () => userEvent.clear(screen.getByRole("textbox", { name: "First name:" })),
            },
            {
                change: () =>
                    userEvent.type(screen.getByRole("textbox", { name: "Last name:" }), "a"),
                undo: () => userEvent.clear(screen.getByRole("textbox", { name: "Last name:" })),
            },
            {
                change: () =>
                    userEvent.type(screen.getByRole("textbox", { name: "Email:" }), "a@email.com"),
                undo: () => userEvent.clear(screen.getByRole("textbox", { name: "Email:" })),
            },
            {
                change: () => userEvent.type(screen.getByLabelText(/Password/), "aaaaaaaaaa"), // min 10 chars
                undo: () => userEvent.clear(screen.getByLabelText(/Password/)),
            },
        ];
        expect(screen.getByRole("button", { name: "Add Staff" })).toBeDisabled();
        inputChangeArray.forEach((changeInputFunc) => changeInputFunc.change());
        expect(screen.getByRole("button", { name: "Add Staff" })).not.toBeDisabled();
        inputChangeArray.forEach((changeInputFunc) => changeInputFunc.undo());
        expect(screen.getByRole("button", { name: "Add Staff" })).toBeDisabled();
    });

    it("should pass user params to addUser API when Add Staff button clicked", async () => {
        mockApiRequests.addUser.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: { id: 5, message: "Success" } }),
        );
        render(
            <ReactDom.MemoryRouter>
                <AddStaff />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Add Staff" })).toBeInTheDocument();

        expect(mockApiRequests.addUser).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "First name:" }), "a");
        userEvent.type(screen.getByRole("textbox", { name: "Last name:" }), "a");
        userEvent.type(screen.getByRole("textbox", { name: "Email:" }), "a@email.com");
        userEvent.type(screen.getByLabelText(/Password/), "aaaaaaaaaa"); // min 10 chars
        userEvent.click(screen.getByRole("button", { name: "Add Staff" }));
        expect(mockApiRequests.addUser).toHaveBeenCalled();
        expect(mockApiRequests.addUser).toHaveBeenLastCalledWith(
            { headers: { authorization: "Bearer token" } },
            "a",
            "a",
            "a@email.com",
            "aaaaaaaaaa",
            MIDLEVEL_DEVELOPER,
            STAFF_USER,
        );
    });

    it("should call addDirectReport API when Add Staff button clicked following addUser called and successfully returns data", async () => {
        const mockNewUserId = 5;

        mockApiRequests.addUser.mockImplementation(() =>
            Promise.resolve({
                ...mockApiResponse,
                data: { id: mockNewUserId, message: "Success" },
            }),
        );

        mockApiRequests.addDirectReport.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: "Success" }),
        );
        render(
            <ReactDom.MemoryRouter>
                <AddStaff />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Add Staff" })).toBeInTheDocument();

        expect(mockApiRequests.addUser).not.toHaveBeenCalled();
        expect(mockApiRequests.addDirectReport).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "First name:" }), "a");
        userEvent.type(screen.getByRole("textbox", { name: "Last name:" }), "a");
        userEvent.type(screen.getByRole("textbox", { name: "Email:" }), "a@email.com");
        userEvent.type(screen.getByLabelText(/Password/), "aaaaaaaaaa"); // min 10 chars
        userEvent.click(screen.getByRole("button", { name: "Add Staff" }));
        expect(mockApiRequests.addUser).toHaveBeenCalled();
        await wait(100);
        expect(mockApiRequests.addDirectReport).toHaveBeenCalled();
        expect(mockApiRequests.addDirectReport).toHaveBeenLastCalledWith(
            { headers: { authorization: "Bearer token" } },
            mockAdminUser.id,
            mockNewUserId,
        );
    });

    it("should not call addDirectReport API when Add Staff button clicked following failed addUser call", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);
        mockApiRequests.addUser.mockImplementation(() => Promise.reject(mockError));
        render(
            <ReactDom.MemoryRouter>
                <AddStaff />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Add Staff" })).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockApiRequests.addUser).not.toHaveBeenCalled();
        expect(mockApiRequests.addDirectReport).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "First name:" }), "a");
        userEvent.type(screen.getByRole("textbox", { name: "Last name:" }), "a");
        userEvent.type(screen.getByRole("textbox", { name: "Email:" }), "a@email.com");
        userEvent.type(screen.getByLabelText(/Password/), "aaaaaaaaaa"); // min 10 chars
        userEvent.click(screen.getByRole("button", { name: "Add Staff" }));
        expect(mockApiRequests.addUser).toHaveBeenCalled();
        await wait(100);
        expect(mockApiRequests.addDirectReport).not.toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith("/", { replace: true }); // refreshes page if addUser fails
    });

    it("should redirect to previous page when Add Staff button clicked and API call successful", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);

        mockApiRequests.addUser.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: { id: 5, message: "Success" } }),
        );

        mockApiRequests.addDirectReport.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: "Success" }),
        );
        render(
            <ReactDom.MemoryRouter>
                <AddStaff />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Add Staff" })).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "First name:" }), "a");
        userEvent.type(screen.getByRole("textbox", { name: "Last name:" }), "a");
        userEvent.type(screen.getByRole("textbox", { name: "Email:" }), "a@email.com");
        userEvent.type(screen.getByLabelText(/Password/), "aaaaaaaaaa"); // min 10 chars
        userEvent.click(screen.getByRole("button", { name: "Add Staff" }));
        await wait(100);
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(-1);
    });

    it("should redirect to previous page when Add Staff button clicked and API ca;; fails", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);

        mockApiRequests.addUser.mockImplementation(() =>
            Promise.resolve({ ...mockApiResponse, data: { id: 5, message: "Success" } }),
        );
        mockApiRequests.addDirectReport.mockImplementation(() => Promise.reject(mockError));
        render(
            <ReactDom.MemoryRouter>
                <AddStaff />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Add Staff" })).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "First name:" }), "a");
        userEvent.type(screen.getByRole("textbox", { name: "Last name:" }), "a");
        userEvent.type(screen.getByRole("textbox", { name: "Email:" }), "a@email.com");
        userEvent.type(screen.getByLabelText(/Password/), "aaaaaaaaaa"); // min 10 chars
        userEvent.click(screen.getByRole("button", { name: "Add Staff" }));
        await wait(100);
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(-1);
    });
});
