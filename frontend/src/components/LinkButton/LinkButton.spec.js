import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LinkButton } from "./LinkButton";

describe("LinkButton", () => {
    it("renders correctly when passed props", async () => {
        const { container } = render(
            <MemoryRouter>
                <LinkButton path="/mypath" name="My Path" />
            </MemoryRouter>,
        );

        const link = await screen.findByRole("link", { name: "My Path" });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/mypath");
        expect(container).toMatchSnapshot();
    });
    it("renders correctly when not passed props", async () => {
        const { container } = render(
            <MemoryRouter>
                <LinkButton />
            </MemoryRouter>,
        );

        const link = await screen.findByRole("link", { name: "Link" });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/");
        expect(container).toMatchSnapshot();
    });
});
