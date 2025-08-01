import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NoDepartures from "./NoDepartures";

describe("<NoDepartures/>", () => {
    it("should render no departures message", () => {
        render(<NoDepartures />);
        const message = screen.getByText("No departures found");
        expect(message).toBeInTheDocument();
    })
})