import {
  TimeOutput,
  YyyyMmDd,
  DepartureOutput,
  StationDepartureDetails,
  Station,
  StationName,
} from 'train-schedule-types'

/**
 * Creates an array out of departure objects with found arrival matches; filters out the undefined.
 * @returns An array of departures with all the necessary response information.
 */
export function getResult(
  possibleDepartures: DepartureOutput[],
  possibleArrivals: StationDepartureDetails[]
) {
  const result: DepartureOutput[] = []
  for (const departure of possibleDepartures) {
    result.push(matchADepartureWithAnArrival(departure, possibleArrivals))
  }
  return result.filter((r) => r !== undefined)
}

/**
 * Finds departure-arrival pairs among pre-filtered departures (which are also enriched)
 * and arrivals based on matching trainIds.
 * When a match is found, real arrival time is written to the enriched departure object.
 * @returns A departure object with all the necessary response information or undefined.
 */
function matchADepartureWithAnArrival(
  departure: DepartureOutput,
  possibleArrivals: StationDepartureDetails[]
) {
  const matchingArrival = possibleArrivals.filter(
    (arrival: StationDepartureDetails) =>
      arrival.trainDetails.id === departure.trainId
  )[0]
  return matchingArrival && writeArrivalTime(departure, matchingArrival)
}

/**
 * Writes actual arrival time over arrival time placeholder in an enriched departure object.
 * @returns A departure with a matching arrival time.
 */
function writeArrivalTime(
  departure: DepartureOutput,
  arrival: StationDepartureDetails
) {
  departure.arrivalTime = timeToString(arrival.time)
  return departure
}

/**
 * Transforms departure objects (adds properties) into format that would be found in the final result.
 * Sets a placeholder for arrival time.
 * @returns Array of enriched departure objects.
 */
export function transformToReturnFormat(
  departures: StationDepartureDetails[],
  stations: Station[],
  departureStationIndex: number,
  arrivalStationIndex: number
) {
  return departures.map((departure: StationDepartureDetails) => {
    return {
      departureTime: timeToString(departure.time),
      arrivalTime: '0:10', // placeholder
      trainId: departure.trainDetails.id,
      from: formatName(stations, departureStationIndex),
      to: formatName(stations, arrivalStationIndex),
    } as DepartureOutput
  })
}

/**
 * Filters departures/arrivals at a station based on input time, inferred direction and frequency.
 * @returns Narrowed down selection of departures that are to be processed further.
 */
export function filterDepartures(
  departures: StationDepartureDetails[],
  time: number,
  direction: 1 | 2,
  frequency: (boolean | string)[]
) {
  return departures.filter((departure: StationDepartureDetails) => {
    return (
      departure.time >= time &&
      departure.trainDetails.directionId === direction &&
      frequency.includes(departure.trainDetails.activeOnWeekendsAndHolidays)
    )
  })
}

/**
 * Converts a number into a time string.
 */
function timeToString(time: number) {
  return time.toFixed(2).split('.').join(':') as TimeOutput
}

/**
 * Converts time string into a number.
 */
export function timeToNumber(time: TimeOutput) {
  return Number(time.split(':').join('.'))
}

/**
 * @returns An array with 2 values of booleans or 1 boolean and 1 string denoting
 * whether a train is active every day (true), Monday to Friday only (false)
 * or weekends and holidays only ("w&h_only");
 * They serve as departure filtering criteria.
 */
export function frequencyOnDate(date: YyyyMmDd, holidays: YyyyMmDd[]) {
  const day = new Date(date).getDay()
  return day === 0 || day === 6 || holidays.includes(date)
    ? [true, 'w&h_only']
    : [true, false]
}

/**
 * @returns Index of station in the list of stations (starting with Batajnica, ending with Ovca).
 */
export function stationIndex(stations: Station[], endpoint: StationName) {
  return stations
    .filter((station: Station) => station.name === endpoint)
    .map((station: Station) => stations.indexOf(station))[0]
}

/**
 * @returns A station name with correct spacing and capitalization.
 */
function formatName(stations: Station[], stationIndex: number) {
  return stations[stationIndex].nameFormatted
}

/**
 * Calculates direction based on departure and arrival station index.
 * @returns Number 1 or 2.
 */
export function direction(
  departureStationIndex: number,
  arrivalStationIndex: number
) {
  return departureStationIndex > arrivalStationIndex ? 2 : 1
}
