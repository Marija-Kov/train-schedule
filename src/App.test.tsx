import { describe, it, expect } from "vitest";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("should render App component in its initial state", () => {
    render(<App />);
    const form = screen.getByRole("form");
    const appInfoBtn = screen.getByText("?");
    expect(form).toBeInTheDocument();
    expect(appInfoBtn).toBeInTheDocument();
  });

  it("should update input/selection value when user types/selects it", async () => {
    user.setup();
    render(<App />);
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
    await user.selectOptions(selectDepartureStation, "zemun");
    await user.selectOptions(selectArrivalStation, "pancevacki most");
    await user.type(selectDateOfDeparture, "2024-10-11");
    await user.type(selectTimeOfDeparture, "14:00");
    expect(selectDepartureStation).toHaveValue("zemun");
    expect(selectArrivalStation).toHaveValue("pancevacki most");
    expect(selectDateOfDeparture).toHaveValue("2024-10-11");
    expect(selectTimeOfDeparture).toHaveValue("14:00");
  });

  it("should highlight input/selection elements with red border on submit given that values are invalid", async () => {
    user.setup();
    render(<App />);
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
    await user.click(searchBtn);
    expect(selectArrivalStation).toHaveAttribute("class", "error");
    expect(selectDepartureStation).toHaveAttribute("class", "error");
    expect(selectDateOfDeparture).toHaveAttribute("class", "error");
    expect(selectTimeOfDeparture).toHaveAttribute("class", "error");
  });

  it("should render Departure components when search button is clicked given that all input/selection values are valid for direction 1", async () => {
    user.setup();
    render(<App />);
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
    await user.selectOptions(selectDepartureStation, "zemun");
    await user.selectOptions(selectArrivalStation, "pancevacki most");
    await user.type(selectDateOfDeparture, "2024-10-11");
    await user.type(selectTimeOfDeparture, "14:00");
    await user.click(searchBtn);
    const departureComponents = await screen.findAllByLabelText("departure");
    const backBtn = await screen.findByLabelText("back to search form");
    expect(departureComponents).toBeTruthy();
    expect(backBtn).toBeInTheDocument();
  });

  it("should render Departure components when search button is clicked given that all input/selection values are valid for direction 2", async () => {
    user.setup();
    render(<App />);
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
    await user.selectOptions(selectDepartureStation, "pancevacki most");
    await user.selectOptions(selectArrivalStation, "zemun");
    await user.type(selectDateOfDeparture, "2024-10-11");
    await user.type(selectTimeOfDeparture, "14:00");
    await user.click(searchBtn);
    const departureComponents = await screen.findAllByLabelText("departure");
    const backBtn = await screen.findByLabelText("back to search form");
    expect(departureComponents).toBeTruthy();
    expect(backBtn).toBeInTheDocument();
  });

  it("should render Departure components when search button is clicked given that all input/selection values are valid - weekends and holidays", async () => {
    user.setup();
    render(<App />);
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
    await user.selectOptions(selectDepartureStation, "pancevacki most");
    await user.selectOptions(selectArrivalStation, "zemun");
    await user.type(selectDateOfDeparture, "2024-11-11");
    await user.type(selectTimeOfDeparture, "14:00");
    await user.click(searchBtn);
    const departureComponents = await screen.findAllByLabelText("departure");
    const backBtn = await screen.findByLabelText("back to search form");
    expect(departureComponents).toBeTruthy();
    expect(backBtn).toBeInTheDocument();
  });

  it("should remove Departure components when 'back' button is clicked", async () => {
    user.setup();
    render(<App />);
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
    await user.selectOptions(selectDepartureStation, "zemun");
    await user.selectOptions(selectArrivalStation, "pancevacki most");
    await user.type(selectDateOfDeparture, "2024-10-11");
    await user.type(selectTimeOfDeparture, "14:00");
    await user.click(searchBtn);
    const backBtn = await screen.findByLabelText("back to search form");
    await user.click(backBtn);
    expect(backBtn).not.toBeInTheDocument();
  });

  it("should show message when no departures were found by search criteria", async () => {
    user.setup();
    render(<App />);
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
    await user.selectOptions(selectDepartureStation, "zemun");
    await user.selectOptions(selectArrivalStation, "pancevacki most");
    await user.type(selectDateOfDeparture, "2024-10-11");
    await user.type(selectTimeOfDeparture, "23:23");
    await user.click(searchBtn);
    const noDeparturesMessage = await screen.findByText("⚠");
    expect(noDeparturesMessage).toBeInTheDocument();
  });

  it("should show app info when question mark button is clicked", async () => {
    user.setup();
    render(<App />);
    const appInfoBtn = screen.getByText("?");
    await user.click(appInfoBtn);
    const linkToRepo = await screen.findByLabelText("repo");
    const backBtn = await screen.findByLabelText("close app info");
    expect(linkToRepo).toBeInTheDocument();
    expect(backBtn).toBeInTheDocument();
  });

  it("should display same station names in the departures heading displaying a direction 2 route when the user goes back to the form and repeats the search without altering the selection of stations", async () => {
    user.setup();
    render(<App />);
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
    await user.selectOptions(selectDepartureStation, "pancevacki most");
    await user.selectOptions(selectArrivalStation, "zemun");
    await user.type(selectDateOfDeparture, "2024-10-11");
    await user.type(selectTimeOfDeparture, "14:00");
    await user.click(searchBtn);
    const routeStart = (await screen.findByLabelText("route start")).innerHTML;
    const routeEnd = (await screen.findByLabelText("route end")).innerHTML;
    const backBtn = await screen.findByLabelText("back to search form");
    await user.click(backBtn);
    await user.click(searchBtn);
    const routeStart2 = (await screen.findByLabelText("route start")).innerHTML;
    const routeEnd2 = (await screen.findByLabelText("route end")).innerHTML;
    expect(routeStart2).toBe(routeStart);
    expect(routeEnd2).toBe(routeEnd);
  });
});
