import { render, screen } from "@testing-library/react";
import { ViewCategories } from "./ViewCategories";
import { mockAdminUser, mockApiRequests, mockError } from "../../setupTests";
import userEvent from "@testing-library/user-event";
import * as ReactDom from "react-router-dom";
import { wait } from "@testing-library/user-event/dist/utils";
import React from "react";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
    };
});

const mockCategory1 = {
    id: 1,
    name: "Category1",
};

const mockCategory2 = {
    id: 2,
    name: "Category2",
};

describe("ViewCategories", () => {
    it("renders correctly when data successful", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getAllCategories.mockImplementation(() =>
            Promise.resolve({ data: [mockCategory1, mockCategory2] }),
        );
        const { container } = render(
            <ReactDom.MemoryRouter>
                <ViewCategories />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "View Categories" })).toBeInTheDocument();

        expect(screen.getByRole("listbox")).toBeInTheDocument();
        expect(screen.getByRole("option", { name: mockCategory1.name })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: mockCategory2.name })).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Edit category" })).toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });

    it("should have Edit category link that has no valid href if no option is selected", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getAllCategories.mockImplementation(() =>
            Promise.resolve({ data: [mockCategory1, mockCategory2] }),
        );
        render(
            <ReactDom.MemoryRouter>
                <ViewCategories />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "View Categories" })).toBeInTheDocument();

        const options = screen.getAllByRole("option");
        options.forEach((option) => {
            expect(option).not.toBeChecked();
        });

        expect(screen.getByRole("link", { name: "Edit category" })).toHaveAttribute(
            "href",
            "/edit/category/undefined",
        );
    });

    it("should have Edit category link that has a valid href if option is selected", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser]);
        // @ts-ignore TODO: fix this
        mockApiRequests.getAllCategories.mockImplementation(() =>
            Promise.resolve({ data: [mockCategory1, mockCategory2] }),
        );
        render(
            <ReactDom.MemoryRouter>
                <ViewCategories />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "View Categories" })).toBeInTheDocument();

        userEvent.selectOptions(screen.getByRole("listbox"), "1");
        await wait(100);

        expect(screen.getByRole("link", { name: "Edit category" })).toHaveAttribute(
            "href",
            `/edit/category/${mockCategory1.id}`,
        );
    });

    it("renders correctly when error", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser]);
        mockApiRequests.getAllCategories.mockImplementation(() => Promise.reject(mockError));
        const { container } = render(
            <ReactDom.MemoryRouter>
                <ViewCategories />
            </ReactDom.MemoryRouter>,
        );
        expect(
            await screen.findByRole("alert", { name: mockError.response.data.error.message }),
        ).toBeInTheDocument();

        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

        expect(screen.queryByRole("link", { name: "Edit category" })).not.toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
});
