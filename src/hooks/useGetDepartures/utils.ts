import {
  DepartureReturned,
  StationDeparture,
  StationDetails,
  Time,
} from "../../typeDefinitions/types";

/**
 * Creates an array out of departure objects with found arrival matches; filters out the undefined.
 * @returns An array of departures with all teh necessary response information.
 */
export function getResult(
  possibleDepartures: DepartureReturned[],
  possibleArrivals: StationDeparture[]
) {
  const result: DepartureReturned[] = [];
  for (let departure of possibleDepartures) {
    result.push(matchADepartureWithAnArrival(departure, possibleArrivals));
  }
  return result.filter((r) => r !== undefined);
}

/**
 * Finds departure-arrival pairs among pre-filtered departures (which are also enriched)
 * and arrivals based on matching trainIds.
 * When a match is found, real arrival time is written to the enriched departure object.
 * @returns A departure object with all the necessary response information or undefined.
 */
function matchADepartureWithAnArrival(
  departure: DepartureReturned,
  possibleArrivals: StationDeparture[]
) {
  const matchingArrival = possibleArrivals.filter(
    (arrival: StationDeparture) => arrival.trainDetails.id === departure.trainId
  )[0];
  return matchingArrival && writeArrivalTime(departure, matchingArrival);
}

/**
 * Writes actual arrival time over arrival time placeholder in an enriched departure object.
 * @returns A departure with a matching arrival time.
 */
function writeArrivalTime(
  departure: DepartureReturned,
  arrival: StationDeparture
) {
  departure.arrivalTime = timeToString(arrival.time);
  return departure;
}

/**
 * Transforms departure objects (adds properties) into format that would be found in the final result.
 * Sets a placeholder for arrival time.
 * @returns Array of enriched departure objects.
 */
export function transformToReturnFormat(
  departures: StationDeparture[],
  stations: StationDetails[],
  departureStationIndex: number,
  arrivalStationIndex: number
) {
  return departures.map((departure: StationDeparture) => {
    return {
      departureTime: timeToString(departure.time),
      arrivalTime: "0:10", // placeholder
      trainId: departure.trainDetails.id,
      from: formatName(stations, departureStationIndex),
      to: formatName(stations, arrivalStationIndex),
    } as DepartureReturned;
  });
}

/**
 * Filters departures/arrivals at a station based on input time, inferred direction and frequency.
 * @returns Narrowed down selection of departures that are to be processed further.
 */
export function filterDepartures(
  departures: StationDeparture[],
  time: number,
  direction: number,
  frequency: (boolean | string)[]
) {
  return departures.filter((departure: StationDeparture) => {
    return (
      departure.time >= time &&
      departure.trainDetails.directionId === direction &&
      frequency.includes(departure.trainDetails.activeOnWeekendsAndHolidays)
    );
  });
}

/**
 * Converts a number into a time string.
 * @param time number (example: 10.3)
 * @returns string (example: "10.30")
 */
function timeToString(time: number) {
  return time.toFixed(2).split(".").join(":") as Time;
}

/**
 * Converts time string into a number.
 * @param time string (example: "10:30")
 * @returns number (example: 10.3)
 */
export function timeToNumber(time: string) {
  return Number(time.split(":").join("."));
}

/**
 * @returns An array with 2 values of booleans or 1 boolean and 1 string denoting
 * whether a train is active every day (true), Monday to Friday only (false)
 * or weekends and holidays only ("w&h_only");
 * They serve as departure filtering criteria.
 */
export function frequencyOnDate(date: string, holidays: string[]) {
  const day = new Date(date).getDay();
  return day === 0 || day === 6 || holidays.includes(date)
    ? [true, "w&h_only"]
    : [true, false];
}

/**
 * @returns Index of station in the list of stations (starting with Batajnica, ending with Ovca).
 */
export function stationIndex(stations: StationDetails[], endpoint: string) {
  return stations
    .filter((station: StationDetails) => station.name === endpoint)
    .map((station: StationDetails) => stations.indexOf(station))[0];
}

/**
 * @returns A station name with correct spacing and capitalization.
 */
function formatName(stations: StationDetails[], stationIndex: number) {
  return stations[stationIndex].nameFormatted;
}

/**
 * Calculates direction based on departure and arrival station index.
 * @returns Number 1 or 2.
 */
export function direction(
  departureStationIndex: number,
  arrivalStationIndex: number
) {
  return departureStationIndex > arrivalStationIndex ? 2 : 1;
}
