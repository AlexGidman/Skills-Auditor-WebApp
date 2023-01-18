import { render, screen } from "@testing-library/react";
import { AddSkill } from "./AddSkill";
import { mockAdminUser, mockApiRequests, mockApiResponse, mockError } from "../../setupTests";
import * as ReactDom from "react-router-dom";
import React from "react";
import { Category } from "../../utility/types";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
    };
});

const mockCategories: Category[] = [
    {
        id: "1",
        name: "Programming",
    },
    {
        id: "2",
        name: "Office365",
    },
    {
        id: "3",
        name: "Version Control",
    },
];

describe("AddSkill", () => {
    it("renders correctly when data successful", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });

        mockApiRequests.getAllCategories.mockImplementation(() =>
            Promise.resolve({
                ...mockApiResponse,
                data: mockCategories,
            }),
        );
        const { container } = render(
            <ReactDom.MemoryRouter>
                <AddSkill />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "Add Skill" })).toBeInTheDocument();
        expect(
            screen.getByRole("textbox", { name: "Enter a skill description:" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Enter a skill description:" })).toHaveValue("");
        expect(
            screen.getByRole("combobox", { name: "Select a skill category" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("combobox", {
                name: "Select a skill category",
            }),
        ).toHaveValue(mockCategories[0].id);

        expect(screen.getByRole("link", { name: "Add Category" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add Skill" })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it("renders correctly when error", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({
            currentUser: mockAdminUser,
            setShowToast: jest.fn(),
        });
        mockApiRequests.getAllCategories.mockImplementation(() => Promise.reject(mockError));
        const { container } = render(
            <ReactDom.MemoryRouter>
                <AddSkill />
            </ReactDom.MemoryRouter>,
        );

        expect(
            await screen.findByRole("alert", { name: mockError.response.data.error.message }),
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("textbox", { name: "Enter a skill description:" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("combobox", { name: "Select a skill category" }),
        ).not.toBeInTheDocument();

        expect(screen.queryByRole("link", { name: "Add Category" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Add Skill" })).not.toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
});
