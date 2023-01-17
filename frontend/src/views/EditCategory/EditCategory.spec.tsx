import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockAdminUser, mockApiRequests, mockError } from "../../setupTests";
import * as ReactDom from "react-router-dom";
import { wait } from "@testing-library/user-event/dist/utils";
import { EditCategory } from "./EditCategory";
import React from "react";
import { Category } from "../../utility/types";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
        useNavigate: jest.fn(),
    };
});

const mockCategory1: Category = {
    id: "1",
    name: "Category1",
};

describe("EditCategory", () => {
    it("renders correctly when data retrieval successful", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getCategory.mockImplementation(() =>
            Promise.resolve({ data: mockCategory1 }),
        );

        const { container } = render(
            <ReactDom.MemoryRouter>
                <EditCategory />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Edit Category" })).toBeInTheDocument();

        expect(screen.getByRole("textbox", { name: "Category description:" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Category description:" })).toHaveValue(
            mockCategory1.name,
        );

        expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled();
        expect(container).toMatchSnapshot();
    });

    it("should have Save changes button that becomes enabled when form has changed", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getCategory.mockImplementation(() =>
            Promise.resolve({ data: mockCategory1 }),
        );

        render(
            <ReactDom.MemoryRouter>
                <EditCategory />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Edit Category" })).toBeInTheDocument();

        const inputChangeArray = [
            {
                change: () =>
                    userEvent.type(
                        screen.getByRole("textbox", { name: "Category description:" }),
                        "a",
                    ),
                undo: () =>
                    userEvent.type(
                        screen.getByRole("textbox", { name: "Category description:" }),
                        "{backspace}",
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
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getCategory.mockImplementation(() =>
            Promise.resolve({ data: mockCategory1 }),
        );
        // @ts-ignore TODO: fix this
        mockApiRequests.updateCategory.mockImplementation(() =>
            Promise.resolve({ data: "success" }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditCategory />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Edit Category" })).toBeInTheDocument();

        expect(mockApiRequests.updateCategory).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "Category description:" }), "a");
        userEvent.click(screen.getByRole("button", { name: "Save changes" }));
        expect(mockApiRequests.updateCategory).toHaveBeenCalled();
    });

    it("should redirect to previous page when save changes button clicked and update successful", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getCategory.mockImplementation(() =>
            Promise.resolve({ data: mockCategory1 }),
        );
        // @ts-ignore TODO: fix this
        mockApiRequests.updateCategory.mockImplementation(() =>
            Promise.resolve({ data: "success" }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditCategory />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Edit Category" })).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "Category description:" }), "a");
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
        mockApiRequests.getCategory.mockImplementation(() =>
            Promise.resolve({ data: mockCategory1 }),
        );

        mockApiRequests.updateCategory.mockImplementation(() => Promise.reject(mockError));
        render(
            <ReactDom.MemoryRouter>
                <EditCategory />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Edit Category" })).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
        userEvent.type(screen.getByRole("textbox", { name: "Category description:" }), "a");
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
        mockApiRequests.getCategory.mockImplementation(() =>
            Promise.resolve({ data: mockCategory1 }),
        );
        render(
            <ReactDom.MemoryRouter>
                <EditCategory />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Edit Category" })).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();

        userEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(-1);
    });
});
