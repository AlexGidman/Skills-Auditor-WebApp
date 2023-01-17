import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockAdminUser, mockApiRequests, mockError } from "../../setupTests";
import * as ReactDom from "react-router-dom";
import { ViewStaff } from "./ViewStaff";
import { wait } from "@testing-library/user-event/dist/utils";
import React from "react";
import { Category, DirectReport, Skill, User } from "../../utility/types";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
        useNavigate: jest.fn(),
    };
});

const mockUser1: User = {
    id: "1",
    firstName: "testfirstName1",
    lastName: "testlastName1",
    email: "test1@email.com",
    password: "testPassword",
    systemRole: "Manager",
    jobRole: "Mid-Level Developer",
};

const mockUser2: User = {
    id: "2",
    firstName: "testfirstName2",
    lastName: "testlastName2",
    email: "test2@email.com",
    password: "testPassword",
    systemRole: "StaffUser",
    jobRole: "Senior Developer",
};

const mockCategory: Category = { id: "1", name: "testname1" };

const mockSkill1: Skill = {
    id: "1",
    name: "Skill1",
    categoryId: mockCategory.id,
    category: mockCategory,
};

const mockSkill2: Skill = {
    id: "2",
    name: "Skill2",
    categoryId: mockCategory.id,
    category: mockCategory,
};

const mockReports: DirectReport[] = [
    { id: "10", report: mockUser1 },
    { id: "20", report: mockUser2 },
];

describe("ViewStaff", () => {
    beforeEach(() => {
        const mockUseOutletContext = ReactDom.useOutletContext as jest.Mock<any, any>;
        mockUseOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => jest.fn());
    });

    it.only("renders correctly when data retrieval successful", async () => {
        // @ts-ignore TODO: fix this
        mockApiRequests.getAllDirectReports.mockImplementation(() =>
            Promise.resolve({ data: mockReports }),
        );
        // @ts-ignore TODO: fix this
        mockApiRequests.getAllStaffSkills.mockImplementation(() =>
            Promise.resolve({ data: [{ id: "100", skill: mockSkill1, skillLevel: "1" }] }),
        );
        const { container } = render(
            <ReactDom.MemoryRouter>
                <ViewStaff />
            </ReactDom.MemoryRouter>,
        );

        expect(await screen.findByRole("heading", { name: "View Staff" })).toBeInTheDocument();

        expect(await screen.findByRole("listbox", { name: "Direct Reports" })).toBeInTheDocument();
        expect(
            await screen.findByRole("option", {
                name: `${mockUser1.firstName} ${mockUser1.lastName}`,
            }),
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("option", {
                name: `${mockUser2.firstName} ${mockUser2.lastName}`,
            }),
        ).toBeInTheDocument();

        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser1.email })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Job role" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser1.jobRole })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "System role" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser1.systemRole })).toBeInTheDocument();

        expect(await screen.findByRole("listbox", { name: "Skills" })).toBeInTheDocument();

        expect(
            await screen.findByRole("option", { name: `${mockSkill1.name} - None` }),
        ).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Edit User" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete Report" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Add Skill" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Edit Skill" })).toBeInTheDocument();
        await wait(1000);

        expect(screen.getByRole("link", { name: "Edit User" })).toHaveAttribute(
            "href",
            `/edit/user/${mockUser1.id}`,
        );
        expect(screen.getByRole("link", { name: "Add Skill" })).toHaveAttribute(
            "href",
            `/addstaffskill/${mockAdminUser.id}`,
        );
        expect(screen.getByRole("link", { name: "Edit Skill" })).toHaveAttribute(
            "href",
            `/edit/staffskill/100`,
        );

        expect(container).toMatchSnapshot();
    });

    it("renders user info and links correctly on Direct Reports listbox option selection", async () => {
        // @ts-ignore TODO: fix this
        mockApiRequests.getAllDirectReports.mockImplementation(() =>
            Promise.resolve({ data: mockReports }),
        );
        // @ts-ignore TODO: fix this
        mockApiRequests.getAllStaffSkills.mockImplementation(() =>
            Promise.resolve({ data: [{ id: "100", skill: mockSkill1, skillLevel: "1" }] }),
        );
        render(
            <ReactDom.MemoryRouter>
                <ViewStaff />
            </ReactDom.MemoryRouter>,
        );

        expect(await screen.findByRole("heading", { name: "View Staff" })).toBeInTheDocument();

        expect(await screen.findByRole("listbox", { name: "Direct Reports" })).toBeInTheDocument();
        expect(
            await screen.findByRole("option", {
                name: `${mockUser1.firstName} ${mockUser1.lastName}`,
            }),
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("option", {
                name: `${mockUser2.firstName} ${mockUser2.lastName}`,
            }),
        ).toBeInTheDocument();

        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser1.email })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Job role" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser1.jobRole })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "System role" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser1.systemRole })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Edit User" })).toHaveAttribute(
            "href",
            `/edit/user/${mockUser1.id}`,
        );

        userEvent.selectOptions(
            await screen.findByRole("listbox", { name: "Direct Reports" }),
            mockUser2.id,
        );
        expect(screen.queryByRole("cell", { name: mockUser1.email })).not.toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser2.email })).toBeInTheDocument();
        expect(screen.queryByRole("cell", { name: mockUser1.jobRole })).not.toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser2.jobRole })).toBeInTheDocument();
        expect(screen.queryByRole("cell", { name: mockUser1.systemRole })).not.toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser2.systemRole })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Edit User" })).toHaveAttribute(
            "href",
            `/edit/user/${mockUser2.id}`,
        );
    });

    it("renders edit staff skill link correctly on Skills listbox option selection", async () => {
        // @ts-ignore TODO: fix this
        mockApiRequests.getAllDirectReports.mockImplementation(() =>
            Promise.resolve({ data: mockReports }),
        );
        // @ts-ignore TODO: fix this
        mockApiRequests.getAllStaffSkills.mockImplementation(() =>
            Promise.resolve({
                data: [
                    { id: "100", skill: mockSkill1, skillLevel: "1" },
                    { id: "200", skill: mockSkill2, skillLevel: "2" },
                ],
            }),
        );
        render(
            <ReactDom.MemoryRouter>
                <ViewStaff />
            </ReactDom.MemoryRouter>,
        );

        expect(await screen.findByRole("heading", { name: "View Staff" })).toBeInTheDocument();

        expect(await screen.findByRole("listbox", { name: "Skills" })).toBeInTheDocument();
        expect(
            await screen.findByRole("option", { name: `${mockSkill1.name} - None` }),
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("option", { name: `${mockSkill2.name} - Basic` }),
        ).toBeInTheDocument();
        await wait(100);

        expect(screen.getByRole("link", { name: "Edit Skill" })).toHaveAttribute(
            "href",
            `/edit/staffskill/100`,
        );

        userEvent.selectOptions(await screen.findByRole("listbox", { name: "Skills" }), "200");
        await wait();
        expect(screen.getByRole("link", { name: "Edit Skill" })).toHaveAttribute(
            "href",
            `/edit/staffskill/200`,
        );
    });

    it("should have delete report button that refreshes the page following deletion of user", async () => {
        // @ts-ignore TODO: fix this
        mockApiRequests.getAllDirectReports.mockImplementation(() =>
            Promise.resolve({ data: mockReports }),
        );
        // @ts-ignore TODO: fix this
        mockApiRequests.getAllStaffSkills.mockImplementation(() =>
            Promise.resolve({
                data: [
                    { id: "100", skill: mockSkill1, skillLevel: "1" },
                    { id: "200", skill: mockSkill2, skillLevel: "2" },
                ],
            }),
        );
        // @ts-ignore TODO: fix this
        mockApiRequests.deleteUser.mockImplementation(() => Promise.resolve({ data: "Success" }));
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);

        render(
            <ReactDom.MemoryRouter>
                <ViewStaff />
            </ReactDom.MemoryRouter>,
        );

        expect(await screen.findByRole("heading", { name: "View Staff" })).toBeInTheDocument();

        expect(await screen.findByRole("listbox", { name: "Direct Reports" })).toBeInTheDocument();
        expect(
            await screen.findByRole("option", {
                name: `${mockUser1.firstName} ${mockUser1.lastName}`,
            }),
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("option", {
                name: `${mockUser2.firstName} ${mockUser2.lastName}`,
            }),
        ).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
        userEvent.click(screen.getByRole("button", { name: "Delete Report" }));
        await wait(100);
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenLastCalledWith(0);
    });

    it("renders correctly when data retrieval fails", async () => {
        mockApiRequests.getAllDirectReports.mockImplementation(() => Promise.reject(mockError));

        const { container } = render(
            <ReactDom.MemoryRouter>
                <ViewStaff />
            </ReactDom.MemoryRouter>,
        );

        expect(await screen.findByRole("alert")).toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });
});
