import { describe, it, expect } from "vitest";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Form from "./Form";

describe("<Form />", () => {
  it("should render Form component properly", () => {
    const stations = [
      "batajnica",
      "kamendin",
      "zemunsko polje",
      "altina",
      "zemun",
      "tosin bunar",
      "novi beograd",
      "beograd centar",
      "karadjordjev park",
      "vukov spomenik",
      "pancevacki most",
      "krnjaca most",
      "krnjaca ukr",
      "sebes",
      "ovca",
    ];
    render(<Form runSetDepartures={() => {}} />);
    const selectDepartureStation = screen.getByLabelText(
      "select departure station"
    );
    const selectArrivalStation = screen.getByLabelText(
      "select arrival station"
    );
    const selectDateOfDeparture = screen.getByLabelText(
      "select date of departure"
    );
    const selectTimeOfDeparture = screen.getByLabelText(
      "select time of departure"
    );
    const searchBtn = screen.getByLabelText("search departures");
    const departureAndArrivalOptions = ["", ...stations, "", ...stations];
    const HTMLInputElements: HTMLInputElement[] = screen.getAllByRole("option");
    const options = HTMLInputElements.map((o) => o.value);
    expect(selectDepartureStation).toBeInTheDocument();
    expect(selectArrivalStation).toBeInTheDocument();
    expect(selectDateOfDeparture).toBeInTheDocument();
    expect(selectTimeOfDeparture).toBeInTheDocument();
    expect(searchBtn).toBeInTheDocument();
    expect(options.length).toEqual(departureAndArrivalOptions.length);
    for (let i = 0; i < options.length; ++i) {
      expect(options[i]).toEqual(departureAndArrivalOptions[i]);
    }
  });

  it("should focus Form component elements in the right order", async () => {
    user.setup();
    render(<Form runSetDepartures={() => {}} />);
    const selectDepartureStation = screen.getByLabelText(
      "select departure station"
    );
    const selectArrivalStation = screen.getByLabelText(
      "select arrival station"
    );
    const selectDateOfDeparture = screen.getByLabelText(
      "select date of departure"
    );
    const selectTimeOfDeparture = screen.getByLabelText(
      "select time of departure"
    );
    const searchBtn = screen.getByLabelText("search departures");
    await user.tab();
    expect(selectDepartureStation).toHaveFocus();
    await user.tab();
    expect(selectArrivalStation).toHaveFocus();
    await user.tab();
    expect(selectDateOfDeparture).toHaveFocus();
    await user.tab();
    expect(selectTimeOfDeparture).toHaveFocus();
    await user.tab();
    expect(searchBtn).toHaveFocus();
  });
});
