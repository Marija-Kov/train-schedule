import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useFetchTrainsAPI from "./useFetchTrainsAPI";
import { StationName, TimeOutput, YyyyMmDd } from "train-schedule-types";
import { hasError } from "../types/typeGuards";

describe("useFetchTrainsAPI", () => {
  it("should return fetchTrainsAPI() function", () => {
    const { result } = renderHook(useFetchTrainsAPI);
    expect(result.current.fetchTrainsAPI).toBeTruthy();
  });
  it("should return error if parameters are missing", async () => {
    const { result } = renderHook(useFetchTrainsAPI);
    const response = await result.current.fetchTrainsAPI({
      from: "altina",
      to: "" as StationName,
      date: "2025-04-04",
      time: "16:04",
    });
    expect(response).toHaveProperty("error");
    if (hasError(response)) {
      expect(response.error).toMatch(/please specify all parameters/i);
    }
  });
  it("should return error if station parameter is invalid", async () => {
    const { result } = renderHook(useFetchTrainsAPI);
    const response = await result.current.fetchTrainsAPI({
      from: "altina",
      to: "novibeograd" as StationName,
      date: "2025-04-04",
      time: "16:04",
    });
    expect(response).toHaveProperty("error");
    if (hasError(response)) {
      expect(response.error).toMatch(
        /Invalid departure and\/or arrival station parameter/i
      );
    }
  });
  it("should return error if date parameter format is invalid", async () => {
    const { result } = renderHook(useFetchTrainsAPI);
    const response = await result.current.fetchTrainsAPI({
      from: "altina",
      to: "novi beograd",
      date: "20250404" as YyyyMmDd,
      time: "16:04",
    });
    expect(response).toHaveProperty("error");
    if (hasError(response)) {
      expect(response.error).toMatch(/Invalid date format/i);
    }
  });
  it("should return error if time parameter format is invalid", async () => {
    const { result } = renderHook(useFetchTrainsAPI);
    const response = await result.current.fetchTrainsAPI({
      from: "altina",
      to: "novi beograd",
      date: "2025-04-04",
      time: "1604" as TimeOutput,
    });
    expect(response).toHaveProperty("error");
    if (hasError(response)) {
      expect(response.error).toMatch(/Invalid time format/i);
    } 
  });
  it("should return message if no departures were found", async () => {
    const { result } = renderHook(useFetchTrainsAPI);
    const response = await result.current.fetchTrainsAPI({
      from: "altina",
      to: "novi beograd",
      date: "2025-04-04",
      time: "23.04" as TimeOutput,
    });
    expect(response).toHaveProperty("error");
    if (hasError(response)) {
      expect(response.error).toMatch(/no departures found/i);
    }
  });
  it("should return data if all parameters are present and valid", async () => {
    const { result } = renderHook(useFetchTrainsAPI);
    const response = await result.current.fetchTrainsAPI({
      from: "altina",
      to: "novi beograd",
      date: "2025-04-04",
      time: "16:04",
    });
    expect(response).toHaveProperty("departureStation");
    expect(response).toHaveProperty("arrivalStation");
    if (!hasError(response)) {
    expect(response.departures.length).toBeTruthy();
    expect(response.departures[0]).toHaveProperty("departureTime");
    expect(response.departures[0]).toHaveProperty("arrivalTime");
    expect(response.departures[0]).toHaveProperty("trainId");
    } 
  });
});
