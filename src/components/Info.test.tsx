import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Info from "./Info";

describe("<Info/>", () => {
  it("should render Info component properly", () => {
    render(<Info />);
    const linkToPdf = screen.getByTestId("schedule-pdf-link");
    const linkToRepo = screen.getByTestId("repo-link");
    const note = screen.getByTestId("note-on-schedule-changes-title");
    const linkToScheduleChangeAnnouncements = screen.getByTestId("schedule-change-announcements");

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
