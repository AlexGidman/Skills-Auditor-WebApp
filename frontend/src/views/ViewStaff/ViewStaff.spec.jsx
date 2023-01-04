import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockAdminUser, mockApiRequests, mockError } from "../../setupTests";
import * as ReactDom from "react-router-dom";
import { ViewStaff } from "./ViewStaff";
import { wait } from "@testing-library/user-event/dist/utils";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
        useNavigate: jest.fn(),
    };
});

const mockUser1 = {
    id: "1",
    forename: "testForename1",
    surname: "testSurname1",
    email: "test1@email.com",
    password: "testPassword",
    system_role: "Manager",
    job_role: "Mid-Level Developer",
};

const mockUser2 = {
    id: "2",
    forename: "testForename2",
    surname: "testSurname2",
    email: "test2@email.com",
    password: "testPassword",
    system_role: "StaffUser",
    job_role: "Senior Developer",
};

const mockCategory = { id: "1", name: "testname1" };

const mockSkill1 = {
    id: 1,
    name: "Skill1",
    category: mockCategory,
};

const mockSkill2 = {
    id: 2,
    name: "Skill2",
    category: mockCategory,
};

const mockReports = [
    { id: "10", report: mockUser1 },
    { id: "20", report: mockUser2 },
];

describe("ViewStaff", () => {
    beforeEach(() => {
        ReactDom.useOutletContext.mockReturnValue([mockAdminUser, jest.fn()]);
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => jest.fn());
    });

    it("renders correctly when data retrieval successful", async () => {
        mockApiRequests.getAllDirectReports.mockImplementation(() =>
            Promise.resolve({ data: mockReports }),
        );
        mockApiRequests.getAllStaffSkills.mockImplementation(() =>
            Promise.resolve({ data: [{ id: "100", skillID: mockSkill1, skill_level: "1" }] }),
        );
        const { container } = render(
            <ReactDom.MemoryRouter>
                <ViewStaff />
            </ReactDom.MemoryRouter>,
        );

        expect(await screen.findByRole("heading", { name: "View Staff" })).toBeInTheDocument();

        expect(screen.getByRole("listbox", { name: "Direct Reports" })).toBeInTheDocument();
        expect(
            await screen.findByRole("option", {
                name: `${mockUser1.forename} ${mockUser1.surname}`,
            }),
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("option", {
                name: `${mockUser2.forename} ${mockUser2.surname}`,
            }),
        ).toBeInTheDocument();

        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser1.email })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Job role" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser1.job_role })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "System role" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser1.system_role })).toBeInTheDocument();

        expect(screen.getByRole("listbox", { name: "Skills" })).toBeInTheDocument();
        expect(
            await screen.findByRole("option", { name: `${mockSkill1.name} - None` }),
        ).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Edit User" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete Report" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Add Skill" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Edit Skill" })).toBeInTheDocument();
        await wait(100);

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
        mockApiRequests.getAllDirectReports.mockImplementation(() =>
            Promise.resolve({ data: mockReports }),
        );
        mockApiRequests.getAllStaffSkills.mockImplementation(() =>
            Promise.resolve({ data: [{ id: "100", skillID: mockSkill1, skill_level: "1" }] }),
        );
        render(
            <ReactDom.MemoryRouter>
                <ViewStaff />
            </ReactDom.MemoryRouter>,
        );

        expect(await screen.findByRole("heading", { name: "View Staff" })).toBeInTheDocument();

        expect(screen.getByRole("listbox", { name: "Direct Reports" })).toBeInTheDocument();
        expect(
            await screen.findByRole("option", {
                name: `${mockUser1.forename} ${mockUser1.surname}`,
            }),
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("option", {
                name: `${mockUser2.forename} ${mockUser2.surname}`,
            }),
        ).toBeInTheDocument();

        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser1.email })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Job role" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser1.job_role })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "System role" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser1.system_role })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Edit User" })).toHaveAttribute(
            "href",
            `/edit/user/${mockUser1.id}`,
        );

        userEvent.selectOptions(
            screen.getByRole("listbox", { name: "Direct Reports" }),
            mockUser2.id,
        );
        expect(screen.queryByRole("cell", { name: mockUser1.email })).not.toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser2.email })).toBeInTheDocument();
        expect(screen.queryByRole("cell", { name: mockUser1.job_role })).not.toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser2.job_role })).toBeInTheDocument();
        expect(screen.queryByRole("cell", { name: mockUser1.system_role })).not.toBeInTheDocument();
        expect(screen.getByRole("cell", { name: mockUser2.system_role })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Edit User" })).toHaveAttribute(
            "href",
            `/edit/user/${mockUser2.id}`,
        );
    });

    it("renders edit staff skill link correctly on Skills listbox option selection", async () => {
        mockApiRequests.getAllDirectReports.mockImplementation(() =>
            Promise.resolve({ data: mockReports }),
        );
        mockApiRequests.getAllStaffSkills.mockImplementation(() =>
            Promise.resolve({
                data: [
                    { id: "100", skillID: mockSkill1, skill_level: "1" },
                    { id: "200", skillID: mockSkill2, skill_level: "2" },
                ],
            }),
        );
        render(
            <ReactDom.MemoryRouter>
                <ViewStaff />
            </ReactDom.MemoryRouter>,
        );

        expect(await screen.findByRole("heading", { name: "View Staff" })).toBeInTheDocument();

        expect(screen.getByRole("listbox", { name: "Skills" })).toBeInTheDocument();
        expect(
            await screen.findByRole("option", { name: `${mockSkill1.name} - None` }),
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("option", { name: `${mockSkill2.name} - None` }),
        ).toBeInTheDocument();
        await wait(100);

        expect(screen.getByRole("link", { name: "Edit Skill" })).toHaveAttribute(
            "href",
            `/edit/staffskill/100`,
        );

        userEvent.selectOptions(screen.getByRole("listbox", { name: "Skills" }), "200");

        expect(screen.getByRole("link", { name: "Edit Skill" })).toHaveAttribute(
            "href",
            `/edit/staffskill/200`,
        );
    });

    it("should have delete report button that refreshes the page following deletion of user", async () => {
        mockApiRequests.getAllDirectReports.mockImplementation(() =>
            Promise.resolve({ data: mockReports }),
        );
        mockApiRequests.getAllStaffSkills.mockImplementation(() =>
            Promise.resolve({
                data: [
                    { id: "100", skillID: mockSkill1, skill_level: "1" },
                    { id: "200", skillID: mockSkill2, skill_level: "2" },
                ],
            }),
        );
        mockApiRequests.deleteUser.mockImplementation(() => Promise.resolve({ data: "Success" }));
        const mockNavigate = jest.fn();
        jest.spyOn(ReactDom, "useNavigate").mockImplementation(() => mockNavigate);

        render(
            <ReactDom.MemoryRouter>
                <ViewStaff />
            </ReactDom.MemoryRouter>,
        );

        expect(await screen.findByRole("heading", { name: "View Staff" })).toBeInTheDocument();

        expect(screen.getByRole("listbox", { name: "Direct Reports" })).toBeInTheDocument();
        expect(
            await screen.findByRole("option", {
                name: `${mockUser1.forename} ${mockUser1.surname}`,
            }),
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("option", {
                name: `${mockUser2.forename} ${mockUser2.surname}`,
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
