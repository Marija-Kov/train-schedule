import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageNotFound from "./PageNotFound";

describe("<PageNotFound/>", () => {
  it("should render PageNotFound component properly", () => {
    render(<PageNotFound />);
    const statusCode = screen.getByText("404");
    const backToHome = screen.getByText(/nazad na početnu/i);
    expect(statusCode).toBeInTheDocument();
    expect(backToHome).toBeInTheDocument();
    expect(backToHome).toHaveAttribute("href", "/");
  });
});