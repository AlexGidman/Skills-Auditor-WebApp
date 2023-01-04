import { render, screen } from "@testing-library/react";
import { ADMIN, MANAGER_SR, STAFF_USER } from "../../utility/types";
import { UserPill } from "./UserPill";

describe("UserPill", () => {
    it("renders correctly when passed manager props", async () => {
        const { container } = render(<UserPill email="test@email.com" systemRole={MANAGER_SR} />);

        expect(
            await screen.findByRole("status", { name: "test@email.com is logged in" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("status", { name: "You are logged in as a manager" }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("status", { name: "You are logged in as an admin" }),
        ).not.toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });
    it("renders correctly when passed admin props", async () => {
        const { container } = render(<UserPill email="test@email.com" systemRole={ADMIN} />);

        expect(
            await screen.findByRole("status", { name: "test@email.com is logged in" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("status", { name: "You are logged in as an admin" }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("status", { name: "You are logged in as a manager" }),
        ).not.toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });
    it("renders correctly when passed staff user props", async () => {
        const { container } = render(<UserPill email="test@email.com" systemRole={STAFF_USER} />);

        expect(
            await screen.findByRole("status", { name: "test@email.com is logged in" }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("status", { name: "You are logged in as a manager" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("status", { name: "You are logged in as an admin" }),
        ).not.toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });
    it("renders correctly when passed no props", async () => {
        const { container } = render(<UserPill />);

        expect(
            await screen.findByRole("status", { name: "No user is logged in" }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("status", { name: "You are logged in as a manager" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("status", { name: "You are logged in as an admin" }),
        ).not.toBeInTheDocument();

        expect(container).toMatchSnapshot();
    });
});
