import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Info from "./Info";

describe("<Info/>", () => {
  it("should render Info component properly", () => {
    render(<Info />);
    const linkToPdf = screen.getByText("reda vožnje za BG voz");
    const linkToRepo = screen.getByLabelText("repo");
    const note = screen.getByText(/podložan vanrednim izmenama/i);
    const linkToScheduleChangeAnnouncements = screen.getByLabelText("schedule change announcements");

    expect(linkToPdf).toHaveAttribute(
      "href",
      "https://www.srbvoz.rs/wp-content/redvoznje/rv_bg_voza_za_2022.pdf"
    );
    expect(linkToRepo).toHaveAttribute(
      "href",
      "https://github.com/Marija-Kov/train-schedule"
    );
    expect(note).toBeInTheDocument();
    expect(linkToScheduleChangeAnnouncements).toHaveAttribute(
      "href", 
      "https://srbijavoz.rs/informacije/"
    );
  });
});
