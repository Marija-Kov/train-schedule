import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AppLayout from "./AppLayout";
import { BrowserRouter } from "react-router";

describe("<AppLayout />", () => {
    it("should render all elements of app layout", () => {
      render(
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>);
      const infoBtn = screen.getByLabelText("more info");
      const homeLink = screen.getByLabelText("home");
      expect(infoBtn).toBeInTheDocument();
      expect(homeLink).toBeInTheDocument();
    });
})