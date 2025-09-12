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
    const selectDepartureStation = screen.getByTestId(
      "select-departure-station"
    );
    const selectArrivalStation = screen.getByTestId(
      "select-arrival-station"
    );
    const selectDateOfDeparture = screen.getByTestId(
      "select-departure-date"
    );
    const selectTimeOfDeparture = screen.getByTestId(
      "select-departure-time"
    );
    const searchBtn = screen.getByTestId("search-departures-btn");
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
    const selectDepartureStation = screen.getByTestId(
      "select-departure-station"
    );
    const selectArrivalStation = screen.getByTestId(
      "select-arrival-station"
    );
    const selectDateOfDeparture = screen.getByTestId(
      "select-departure-date"
    );
    const selectTimeOfDeparture = screen.getByTestId(
      "select-departure-time"
    );
    const searchBtn = screen.getByTestId("search-departures-btn");
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
    const selectDepartureStation = screen.getByTestId(
      "select-departure-station"
    );
    const selectArrivalStation = screen.getByTestId(
      "select-arrival-station"
    );
    const searchBtn = screen.getByTestId("search-departures-btn");
    await user.click(searchBtn);
    const errorMarks = screen.getAllByTestId("missing-input-mark");
    expect(selectArrivalStation).toHaveAttribute("class", "error");
    expect(selectDepartureStation).toHaveAttribute("class", "error");
    expect(errorMarks.length).toBe(2);
  });

  it("should navigate away when search button is clicked given that all input/selection values are provided", async () => {
    user.setup();
    vi.mock(import("react-router"), async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        useNavigate: () => vi.fn()
      }
    });
    using spy = vi.spyOn((await import("react-router")), "useNavigate");
    render(
      <BrowserRouter>
        <Form />
      </BrowserRouter>);
    const selectDepartureStation = screen.getByTestId(
      "select-departure-station"
    );
    const selectArrivalStation = screen.getByTestId(
      "select-arrival-station"
    );
    const selectDateOfDeparture = screen.getByTestId(
      "select-departure-date"
    );
    const selectTimeOfDeparture = screen.getByTestId(
      "select-departure-time"
    );
    const searchBtn = screen.getByTestId("search-departures-btn");
    const input = { from: "zemun", to: "ovca", date: "2025-10-11", time: "14:00"};
    await user.selectOptions(selectDepartureStation, input.from);
    await user.selectOptions(selectArrivalStation, input.to);
    await user.type(selectDateOfDeparture, input.date);
    await user.type(selectTimeOfDeparture, input.time);
    await user.click(searchBtn);
    expect(spy).toHaveBeenCalled();
    /*
      TODO: Ideally, we want to grab the navigate function and test whether it has been called with the right argument.
      expect(navigate, "Error Calling navigate with").toHaveBeenCalledWith(`/departures/${input.from}/${input.to}/${input.date}/${input.time}`);
    */
  });

  // TODO: should store last submitted input in sessionStorage and show it in the form
  // when the user navigates back to the form view
});
