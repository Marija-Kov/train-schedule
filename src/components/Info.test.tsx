import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Info from "./Info";

describe("<Info/>", () => {
  it("should render Info component properly", () => {
    render(<Info toggleAppInfoVisibility={() => {}} />);
    const linkToPdf = screen.getByText("reda vožnje za BG voz");
    const linkToRepo = screen.getByLabelText("repo");
    const closeAppInfoBtn = screen.getByLabelText("close app info");
    expect(linkToPdf).toHaveAttribute(
      "href",
      "https://www.srbvoz.rs/wp-content/redvoznje/rv_bg_voza_za_2022.pdf"
    );
    expect(linkToRepo).toHaveAttribute(
      "href",
      "https://github.com/Marija-Kov/train-schedule"
    );
    expect(closeAppInfoBtn).toBeInTheDocument();
  });
});
