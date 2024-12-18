import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
const url = "http://localhost:3003";

const handlers = [
  http.get(`${url}/departures/altina//2025-04-04/16.04`, () => {
    return HttpResponse.json({ error: "Please specify all parameters" });
  }),
  http.get(`${url}/departures/altina/novibeograd/2025-04-04/16.04`, () => {
    return HttpResponse.json({
      error: "Invalid departure and/or arrival station parameter",
    });
  }),
  http.get(`${url}/departures/altina/novi-beograd/20250404/16.04`, () => {
    return HttpResponse.json({ error: "Invalid date format" });
  }),
  http.get(`${url}/departures/altina/novi-beograd/2025-04-04/1604`, () => {
    return HttpResponse.json({ error: "Invalid time format" });
  }),
  http.get(`${url}/departures/altina/novi-beograd/2025-04-04/23.04`, () => {
    return HttpResponse.json({ error: "No departures found" });
  }),
  http.get(`${url}/departures/altina/novi-beograd/2025-04-04/16.04`, () => {
    return HttpResponse.json({
      departureStation: "Altina",
      arrivalStation: "Novi Beograd",
      departures: [
        {
          departureTime: "16:35",
          arrivalTime: "16:46",
          trainId: 8035,
        },
        //...
      ],
    });
  }),

  // App.test
  // direction1
  http.get(`${url}/departures/zemun/pancevacki-most/2025-10-11/14.00`, () => {
    return HttpResponse.json({
      departureStation: "Zemun",
      arrivalStation: "Pančevački most",
      departures: [
        {
          departureTime: "14:09",
          arrivalTime: "14:32",
          trainId: 8025,
        },
        //...
      ],
    });
  }),
  //direction2
  http.get(`${url}/departures/pancevacki-most/zemun/2025-10-11/14.00`, () => {
    return HttpResponse.json({
      departureStation: "Pančevački most",
      arrivalStation: "Zemun",
      departures: [
        {
          departureTime: "14:15",
          arrivalTime: "14:36",
          trainId: 8026,
        },
        //...
      ],
    });
  }),
  //w&h
  http.get(`${url}/departures/pancevacki-most/zemun/2025-11-11/14.00`, () => {
    return HttpResponse.json({
      departureStation: "Pančevački most",
      arrivalStation: "Zemun",
      departures: [
        {
          departureTime: "14:15",
          arrivalTime: "14:36",
          trainId: 8026,
        },
        //...
      ],
    });
  }),
  //no departures found
  http.get(`${url}/departures/zemun/pancevacki-most/2025-10-11/23.23`, () => {
    return HttpResponse.json({ error: "No departures found" });
  }),
];

export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
