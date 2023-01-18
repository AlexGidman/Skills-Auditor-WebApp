import { render, screen } from "@testing-library/react";
import { mockAdminUser } from "../../setupTests";
import { AddCategory } from "./AddCategory";
import * as ReactDom from "react-router-dom";
import React from "react";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
    };
});

describe("AddCategory", () => {
    it("renders correctly when data successful", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });
        const { container } = render(
            <ReactDom.MemoryRouter>
                <AddCategory />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Add Category" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Enter a category name:" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Enter a category name:" })).toHaveValue("");

        expect(screen.getByRole("button", { name: "Add Category" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
});
