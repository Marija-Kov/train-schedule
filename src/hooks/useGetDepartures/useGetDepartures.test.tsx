import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useGetDepartures from "./useGetDepartures";

describe("useGetDepartures", () => {
  it("should return getDepartures() function", () => {
    const { result } = renderHook(useGetDepartures);
    expect(result.current.getDepartures).toBeTruthy();
  });
});
