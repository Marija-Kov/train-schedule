import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Departure from "./Departure";

describe("<Departure />", () => {
  it("should render Departure component properly", () => {
    render(
      <Departure departureTime={"12:0"} arrivalTime={"12:15"} trainId={8000} />
    );
    const departureTime = screen.getByLabelText("departure time");
    const arrivalTime = screen.getByLabelText("arrival time");
    const trainId = screen.getByLabelText("train id number");
    expect(departureTime).toBeInTheDocument();
    expect(arrivalTime).toBeInTheDocument();
    expect(trainId).toBeInTheDocument();
  });
});
