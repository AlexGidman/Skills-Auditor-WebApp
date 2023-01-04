import { render, screen } from "@testing-library/react";
import { MyDetails } from "./MyDetails";
import { mockApiRequests } from "../../setupTests";
import * as ReactDom from "react-router-dom";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
    };
});

const mockUser = {
    id: 1,
    forename: "John",
    surname: "Smith",
    email: "John@email.com",
    job_role: "Manager",
    system_role: "Admin",
};

describe("MyDetails", () => {
    it("renders correctly with currentUser's details", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockUser]);
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
        expect(screen.getByRole("cell", { name: mockUser.forename })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Last name" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser.surname })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser.email })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Job role" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser.job_role })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "System role" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser.system_role })).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Edit user details" })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it("should have LinkButton that links to /edit/user/:userId when data successful", async () => {
        ReactDom.useOutletContext.mockReturnValue([mockUser]);
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
