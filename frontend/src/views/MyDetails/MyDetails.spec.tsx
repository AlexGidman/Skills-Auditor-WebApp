import { render, screen } from "@testing-library/react";
import { MyDetails } from "./MyDetails";
import { mockApiRequests } from "../../setupTests";
import * as ReactDom from "react-router-dom";
import React from "react";
import { ADMIN, MANAGER_JR, User } from "../../utility/types";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
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

describe("MyDetails", () => {
    it("renders correctly with currentUser's details", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({ currentUser: mockUser });
        // @ts-ignore TODO: fix this
        mockApiRequests.getUserDetails.mockImplementation(() =>
            Promise.resolve({ data: mockUser }),
        );
        const { container } = render(
            <ReactDom.MemoryRouter>
                <MyDetails />
            </ReactDom.MemoryRouter>,
        );
        expect(await screen.findByRole("heading", { name: "My Details" })).toBeInTheDocument();

        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "First name" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser.firstName })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Last name" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser.lastName })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser.email })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Job role" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser.jobRole })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "System role" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser.systemRole })).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Edit user details" })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it("should have LinkButton that links to /edit/user/:userId when data successful", async () => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue({ currentUser: mockUser });
        // @ts-ignore TODO: fix this
        mockApiRequests.getUserDetails.mockImplementation(() =>
            Promise.resolve({ data: mockUser }),
        );
        render(
            <ReactDom.MemoryRouter>
                <MyDetails />
            </ReactDom.MemoryRouter>,
        );
        const editUserDetailsLinkButton = await screen.findByRole("link", {
            name: "Edit user details",
        });
        expect(editUserDetailsLinkButton).toHaveAttribute("href", `/edit/user/${mockUser.id}`);
    });
});
