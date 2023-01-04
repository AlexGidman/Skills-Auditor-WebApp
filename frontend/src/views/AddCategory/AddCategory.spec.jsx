import { render, screen } from "@testing-library/react";
import { mockAdminUser, mockError } from "../../setupTests";
import { AddCategory } from "./AddCategory";
import * as ReactDom from "react-router-dom";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
    };
});

describe("AddCategory", () => {
    it("renders correctly when data successful", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
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
