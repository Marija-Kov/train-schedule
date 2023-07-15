import {describe, it, expect} from 'vitest';
import user from "@testing-library/user-event";
import {render, screen} from '@testing-library/react';
import App from "./App";

describe("App", () => {
    it("should render App component in its initial state", () => {
      render(<App />);
      const form = screen.getByRole("form");
      expect(form).toBeInTheDocument();
    });

    it("should update input/selection value when user types/selects it", async () => {
       user.setup();
       render(<App />);
       const selectDepartureStation = screen.getByLabelText("select departure station");
       const selectArrivalStation = screen.getByLabelText("select arrival station");
       const selectDateOfDeparture = screen.getByLabelText("select date of departure");
       const selectTimeOfDeparture = screen.getByLabelText("select time of departure");
       await user.selectOptions(selectDepartureStation, "zemun");
       await user.selectOptions(selectArrivalStation, "pancevacki most");
       await user.type(selectDateOfDeparture, "2023-10-11");
       await user.type(selectTimeOfDeparture, "14:00");
       expect(selectDepartureStation).toHaveValue("zemun");
       expect(selectArrivalStation).toHaveValue("pancevacki most");
       expect(selectDateOfDeparture).toHaveValue("2023-10-11");
       expect(selectTimeOfDeparture).toHaveValue("14:00");
    });

    it("should highlight input/selection elements with red border on submit given that values are invalid", async () => {
        user.setup();
        render(<App />);
        const selectDepartureStation = screen.getByLabelText("select departure station");
        const selectArrivalStation = screen.getByLabelText("select arrival station");
        const selectDateOfDeparture = screen.getByLabelText("select date of departure");
        const selectTimeOfDeparture = screen.getByLabelText("select time of departure");
        const searchBtn = screen.getByLabelText("search departures");
        await user.selectOptions(selectDepartureStation, "zemun");
        await user.type(selectDateOfDeparture, "2023-10-11");
        await user.click(searchBtn);
        expect(selectArrivalStation).toHaveAttribute("class", "error");
        expect(selectTimeOfDeparture).toHaveAttribute("class", "error");
    });

    it("should unmount Form component and render Departure components when search button is clicked given that all input/selection values are valid", async () => {
        user.setup();
        render(<App />);
        const selectDepartureStation = screen.getByLabelText("select departure station");
        const selectArrivalStation = screen.getByLabelText("select arrival station");
        const selectDateOfDeparture = screen.getByLabelText("select date of departure");
        const selectTimeOfDeparture = screen.getByLabelText("select time of departure");
        const searchBtn = screen.getByLabelText("search departures");
        await user.selectOptions(selectDepartureStation, "zemun");
        await user.selectOptions(selectArrivalStation, "pancevacki most");
        await user.type(selectDateOfDeparture, "2023-10-11");
        await user.type(selectTimeOfDeparture, "14:00");
        await user.click(searchBtn);
        const departureComponents = await screen.findAllByLabelText("departure");
        const backBtn = await screen.findByLabelText("back to search form");
        expect(searchBtn).not.toBeInTheDocument();
        expect(departureComponents).toBeTruthy();
        expect(backBtn).toBeInTheDocument();
    });

    it("should run a function to change departures state to [] and remove Departure components when 'back' button is clicked", async () => {
        user.setup();
        render(<App />);
        const selectDepartureStation = screen.getByLabelText("select departure station");
        const selectArrivalStation = screen.getByLabelText("select arrival station");
        const selectDateOfDeparture = screen.getByLabelText("select date of departure");
        const selectTimeOfDeparture = screen.getByLabelText("select time of departure");
        let searchBtn = screen.getByLabelText("search departures");
        await user.selectOptions(selectDepartureStation, "zemun");
        await user.selectOptions(selectArrivalStation, "pancevacki most");
        await user.type(selectDateOfDeparture, "2023-10-11");
        await user.type(selectTimeOfDeparture, "14:00");
        await user.click(searchBtn);
        const backBtn = await screen.findByLabelText("back to search form");
        await user.click(backBtn);
        expect(backBtn).not.toBeInTheDocument();
        searchBtn = await screen.findByLabelText("search departures"); // ⟢ if you just use element from the old render (line 72), the test will fail
        expect(searchBtn).toBeInTheDocument();
    })
})


