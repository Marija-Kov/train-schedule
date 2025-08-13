import { describe, it, expect } from "vitest";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import DeparturesLayout from "./DeparturesLayout";
import { DeparturesContext } from "../context/DeparturesContext";

describe("<DeparturesLayout />", () => {
    it("should render the layout properly", () => {
        render(
            <BrowserRouter>
                <DeparturesLayout />
            </BrowserRouter>);
        const departureTimeColumnHeading = screen.getByTestId("departure-title");
        const arrivalTimeColumnHeading = screen.getByTestId("arrival-title");
        const trainIdColumnHeading = screen.getByTestId("train-no-title");
        expect(departureTimeColumnHeading).toBeInTheDocument();
        expect(arrivalTimeColumnHeading).toBeInTheDocument();
        expect(trainIdColumnHeading).toBeInTheDocument();
    });

    it("should render the loader", () => {
        render(
            <BrowserRouter>
                <DeparturesContext.Provider value={{ departures: [], loading: true }}>
                    <DeparturesLayout />
                </DeparturesContext.Provider>
            </BrowserRouter>);
        const loader = screen.getByTestId("loader");
        expect(loader).toBeInTheDocument();
    });

    it("should render no departures found message", () => {
        render(
            <BrowserRouter>
                <DeparturesContext.Provider value={{ departures: [], loading: false }}>
                    <DeparturesLayout />
                </DeparturesContext.Provider>
            </BrowserRouter>);
        const noDepartures = screen.getByTestId("no-departures-message");
        expect(noDepartures).toBeInTheDocument();
    });

    it("should render departures", () => {
        render(
            <BrowserRouter>
                <DeparturesContext.Provider value={{
                    departures: [
                        {
                            departureTime: "0:01",
                            arrivalTime: "0:02",
                            trainId: 8003
                        }
                    ], loading: false
                }}>
                    <DeparturesLayout />
                </DeparturesContext.Provider>
            </BrowserRouter>);
        const departureTime = screen.getByText("0:01");
        const arrivalTime = screen.getByText("0:02");
        const trainId = screen.getByText("8003");
        expect(departureTime).toBeInTheDocument();
        expect(arrivalTime).toBeInTheDocument();
        expect(trainId).toBeInTheDocument();

    });

    it("should navigate to form when back button is clicked", async () => {
        user.setup();
        render(
            <BrowserRouter>
                <DeparturesContext.Provider value={{ departures: [], loading: false }}>
                    <DeparturesLayout />
                </DeparturesContext.Provider>
            </BrowserRouter>);
        const back = screen.getByTestId("back-to-form");
        await user.click(back);
        const form = await screen.findByTestId("search-form");
        expect(form).toBeInTheDocument();
    });
})