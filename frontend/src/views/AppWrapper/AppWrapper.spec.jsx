import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockApiRequests, mockAdminUser } from "../../setupTests";
import * as rrd from "react-router-dom";
import * as reactCookie from "react-cookie";
import * as helper from "../../utility/helper";
import { wait } from "@testing-library/user-event/dist/utils";

import { AppWrapper } from "./AppWrapper";

jest.mock("react-router-dom", () => {
    return {
        ...jest.requireActual("react-router-dom"),
        useOutletContext: jest.fn(),
        useNavigate: jest.fn(),
    };
});

describe("AppWrapper", () => {
    it("renders correctly", async () => {
        jest.spyOn(reactCookie, "useCookies").mockImplementation(() => [
            { token: "Bearer token" },
            jest.fn(),
            jest.fn(),
        ]);

        mockApiRequests.getUserFromToken.mockImplementation(() =>
            Promise.resolve({ data: mockAdminUser }),
        );

        const mockNavigate = jest.fn();
        jest.spyOn(rrd, "useNavigate").mockImplementation(() => mockNavigate);
        const { container } = render(
            <MemoryRouter>
                <AppWrapper />
            </MemoryRouter>,
        );
        await wait(200);
        expect(screen.getAllByRole("navigation").length).toBe(2);
        expect(screen.getAllByRole("link").length).toBe(16);
        expect(
            screen.getByRole("status", { name: "You are logged in as an admin" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("status", { name: `${mockAdminUser.email} is logged in` }),
        ).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
    it("should log user out if user is not authenticated", async () => {
        const spyLogout = jest.spyOn(helper, "useLogout");
        jest.spyOn(reactCookie, "useCookies").mockImplementation(() => [
            { token: null },
            jest.fn(),
            jest.fn(),
        ]);
        jest.spyOn(rrd, "useNavigate").mockImplementation(() => jest.fn());
        expect(spyLogout).not.toHaveBeenCalled();
        render(
            <MemoryRouter>
                <AppWrapper />
            </MemoryRouter>,
        );
        await wait(200);
        expect(spyLogout).toHaveBeenCalled();
    });
});
