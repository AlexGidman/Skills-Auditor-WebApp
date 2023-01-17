import { render, screen } from "@testing-library/react";
import React from "react";
import { Homepage } from "./Homepage";

describe("Homepage", () => {
    it("renders correctly", async () => {
        const { container } = render(<Homepage />);
        expect(
            await screen.findByRole("heading", { name: "Welcome to Skills Auditor!" }),
        ).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
});
