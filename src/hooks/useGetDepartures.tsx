import {
  DepartureReturned,
  Input,
  StationDeparture,
  StationDetails,
  Time,
} from "../typeDefinitions/types";
import useFetchData from "./useFetchData";

const useGetDepartures = () => {
  const { fetchData } = useFetchData();

  const getDepartures = async (
    input: Input
  ): Promise<DepartureReturned[] | string> => {
    if (!input.from || !input.to || !input.date || !input.time)
      return "All fields must be filled";

    if (input.from === input.to) return "That is not a route";

    const data = await fetchData();
    const stations = data.stations;
    const frequency = frequencyOnDate(input.date, data.holidays);
    const indexFrom = stationIndex(stations, input.from);
    const indexTo = stationIndex(stations, input.to);

    const possibleDepartures = filterDepartures(
      stations[indexFrom].departures,
      timeToNumber(input.time),
      direction(indexFrom, indexTo),
      frequency
    );

    if (!possibleDepartures.length) return "no departures";

    const possibleDeparturesEnriched = transformToReturnFormat(
      possibleDepartures,
      stations,
      indexFrom,
      indexTo
    );

    const possibleArrivals = filterDepartures(
      stations[indexTo].departures,
      timeToNumber(input.time),
      direction(indexFrom, indexTo),
      frequency
    );

    return getResult(possibleDeparturesEnriched, possibleArrivals);
  };

  /**
   * Creates an array out of departure objects with found arrival matches; filters out the undefined.
   * @returns An array of departures with all teh necessary response information.
   */
  function getResult(
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
      (arrival: StationDeparture) =>
        arrival.trainDetails.id === departure.trainId
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
  function transformToReturnFormat(
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
  function filterDepartures(
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

  function timeToString(time: number) {
    return time.toFixed(2).split(".").join(":") as Time;
  }

  function timeToNumber(time: string) {
    return Number(time.split(":").join("."));
  }

  /**
   * @returns An array with 2 values of booleans or 1 boolean and 1 string denoting 
   * whether a train is active every day (true), Monday to Friday only (false) 
   * or weekends and holidays only ("w&h_only"); 
   * They serve as departure filtering criteria.
   */
  function frequencyOnDate(date: string, holidays: string[]) {
    const day = new Date(date).getDay();
    return day === 0 || day === 6 || holidays.includes(date)
      ? [true, "w&h_only"]
      : [true, false];
  }

  /**
   * @returns Index of station in the list of stations (starting with Batajnica, ending with Ovca).
   */
  function stationIndex(stations: StationDetails[], endpoint: string) {
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

  function direction(
    departureStationIndex: number,
    arrivalStationIndex: number
  ) {
    return departureStationIndex > arrivalStationIndex ? 2 : 1;
  }

  return { getDepartures };
};

export default useGetDepartures;
