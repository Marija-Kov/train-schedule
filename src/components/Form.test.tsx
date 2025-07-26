import { vi, describe, it, expect } from "vitest";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Form from "./Form";
import { BrowserRouter } from "react-router";

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
    render(
      <BrowserRouter>
        <Form />
      </BrowserRouter>);
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
    render(
      <BrowserRouter>
        <Form />
      </BrowserRouter>);
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

  it("should highlight input/selection elements with red border on submit given that values are invalid", async () => {
    user.setup();
    render(
      <BrowserRouter>
        <Form />
      </BrowserRouter>);
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
  // TODO: how do we make this work?
  it("should call navigate() with correct parameters when search button is clicked given that all input/selection values are provided", async () => {
    user.setup();
    vi.mock(import("react-router"), async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        useNavigate: () => {
          const navigate = vi.fn();
          return navigate;
        }
      }
    });
    const mockNavigate = (await import("react-router")).useNavigate();
    render(
      <BrowserRouter>
        <Form />
      </BrowserRouter>);
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
    await user.type(selectDateOfDeparture, "2025-10-11");
    await user.type(selectTimeOfDeparture, "14:00");
    await user.click(searchBtn);
    expect(mockNavigate).toHaveBeenCalledWith('departures/zemun/pancevacki%20most/2025-10-11/14:00');
  });

  // TODO: should store last submitted input in sessionStorage and show it in the form
  // when the user navigates back to the form view
});
