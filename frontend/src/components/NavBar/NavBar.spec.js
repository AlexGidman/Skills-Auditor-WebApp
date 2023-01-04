import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ADMIN, MANAGER_SR, STAFF_USER } from "../../utility/types";
import { NavBar, HamburgerNavBar } from "./NavBar";

describe("NavBar", () => {
    it("renders correctly when passed staff user props", async () => {
        const { container } = render(
            <MemoryRouter>
                <NavBar systemRole={STAFF_USER} />
            </MemoryRouter>,
        );

        const links = await screen.findAllByRole("link");
        expect(links.length).toBe(3);
        expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
    it("renders correctly when passed manager props", async () => {
        const { container } = render(
            <MemoryRouter>
                <NavBar systemRole={MANAGER_SR} />
            </MemoryRouter>,
        );

        const links = await screen.findAllByRole("link");
        expect(links.length).toBe(8);
        expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });
    it("renders correctly when passed admin props", async () => {
        const { container } = render(
            <MemoryRouter>
                <NavBar systemRole={ADMIN} />
            </MemoryRouter>,
        );

        const links = await screen.findAllByRole("link");
        expect(links.length).toBe(8);
        expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });
});

describe("HamburgerNavBar", () => {
    it("renders correctly when passed staff user props", async () => {
        const { container } = render(
            <MemoryRouter>
                <HamburgerNavBar systemRole={STAFF_USER} />
            </MemoryRouter>,
        );

        const links = await screen.findAllByRole("link");
        expect(links.length).toBe(3);
        expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Navigation" })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
    it("renders correctly when passed manager props", async () => {
        const { container } = render(
            <MemoryRouter>
                <HamburgerNavBar systemRole={MANAGER_SR} />
            </MemoryRouter>,
        );

        const links = await screen.findAllByRole("link");
        expect(links.length).toBe(8);
        expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Navigation" })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
    it("renders correctly when passed admin props", async () => {
        const { container } = render(
            <MemoryRouter>
                <HamburgerNavBar systemRole={ADMIN} />
            </MemoryRouter>,
        );

        const links = await screen.findAllByRole("link");
        expect(links.length).toBe(8);
        expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Navigation" })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
});
