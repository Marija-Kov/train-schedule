import {
  TimeOutput,
  YyyyMmDd,
  DepartureOutput,
  StationDepartureDetails,
  Station,
  StationName,
  TimeInput,
  Train,
  ServiceFrequency,
  TrainId,
  StationNameDisplay,
} from 'train-schedule-types'

export const stationNamesDisplayMap: {
  [key in StationName]: StationNameDisplay
} = {
  batajnica: 'Batajnica',
  kamendin: 'Kamendin',
  'zemunsko polje': 'Zemunsko polje',
  altina: 'Altina',
  zemun: 'Zemun',
  'tosin bunar': 'Tošin bunar',
  'novi beograd': 'Novi Beograd',
  'beograd centar': 'Beograd centar',
  'karadjordjev park': 'Karađorđev park',
  'vukov spomenik': 'Vukov spomenik',
  'pancevacki most': 'Pančevački most',
  'krnjaca most': 'Krnjača most',
  'krnjaca ukr': 'Krnjača ukr.',
  sebes: 'Sebeš',
  ovca: 'Ovča',
  rakovica: 'Rakovica',
  knezevac: 'Kneževac',
  kijevo: 'Kijevo',
  resnik: 'Resnik',
  'ripanj kolonija': 'Ripanj kolonija',
  ripanj: 'Ripanj',
  klenje: 'Klenje',
  'ripanj tunel': 'Ripanj tunel',
  ralja: 'Ralja',
  'sopot kosmajski': 'Sopot Kosmajski',
  'vlasko polje': 'Vlaško Polje',
  mladenovac: 'Mladenovac',
  'bela reka': 'Bela reka',
  'barajevo ukr': 'Barajevo ukr.',
  'barajevo centar': 'Barajevo Centar',
  'veliki borak': 'Veliki Borak',
  'leskovac kolubarski': 'Leskovac Kolubarski',
  stepojevac: 'Stepojevac',
  vreoci: 'Vreoci',
  lazarevac: 'Lazarevac',
}

const getDirectArrivals = (
  stations: { [key in StationName]: Station },
  trains: { [key in TrainId]: Train },
  from: StationName,
  to: StationName,
  serviceFrequency: ServiceFrequency[],
  time: TimeInput,
  checkedTrainsArray: TrainId[]
): {
  departureSt: StationName
  arrivalSt: StationName
  departureTime: TimeInput
  arrivalTime: TimeInput
  trainId: TrainId
  layover: {
    station: StationName
    arrivalTime: TimeInput
    departureTime: TimeInput // TODO: should probably return TimeOutput
    waitTime: string
    trainId: TrainId
  }
}[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any[] = []
  const departuresFromTheStationByQueriedTimeAndFrequency = stations[
    from
  ].departures.filter(
    (d) =>
      d.time >= Number(time) &&
      (d.trainDetails.serviceFrequency === serviceFrequency[0] ||
        d.trainDetails.serviceFrequency === serviceFrequency[1]) &&
      d
  )
  departuresFromTheStationByQueriedTimeAndFrequency.forEach((d) => {
    const trainId = d.trainDetails.id
    if (checkedTrainsArray.includes(trainId)) return
    result = [
      ...result,
      ...trains[trainId].itinerary
        .filter((i) => i.station === to)
        .map((i) => {
          checkedTrainsArray.push(trainId)
          return {
            departureTime: d.time,
            arrivalTime: i.time,
            trainId: trainId,
            layover: null, // for all direct arrivals
          }
        }),
    ]
  })
  return result.filter(
    (e) => e !== undefined && e.departureTime < e.arrivalTime
  )
}

const getLayoverStationAndArrivalTimes = (
  stations: { [key in StationName]: Station },
  trains: { [key in TrainId]: Train },
  from: StationName,
  to: StationName,
  serviceFrequency: ServiceFrequency[],
  time: TimeInput,
  checkedTrainsArray: TrainId[]
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any[] = []
  const departuresFromTheStationByQueriedTimeAndFrequency = stations[
    from
  ].departures.filter(
    (d) =>
      d.time >= Number(time) &&
      (d.trainDetails.serviceFrequency === serviceFrequency[0] ||
        d.trainDetails.serviceFrequency === serviceFrequency[1]) &&
      d
  )
  departuresFromTheStationByQueriedTimeAndFrequency.forEach((d) => {
    const trainId = d.trainDetails.id
    if (checkedTrainsArray.includes(trainId)) return
    result = [
      ...result,
      ...trains[trainId].itinerary
        .filter((i) => i.station === 'karadjordjev park') // karadjordjev park is a layover station for all train lines
        .map((i) => {
          checkedTrainsArray.push(trainId)
          return {
            station: i.station,
            departureTime: d.time,
            arrivalTime: i.time,
            trainId: trainId,
          }
        }),
    ]
  })
  return result.filter(
    (e) => e !== undefined && e.departureTime < e.arrivalTime
  )
}

function subtractHHMM(minuend: TimeInput, subtrahend: TimeInput) {
  let minuendHH = Math.trunc(Number(minuend))
  const subtrahendHH = Math.trunc(Number(subtrahend))
  if (minuendHH < subtrahendHH) {
    console.error('Bad input: minuend must be greater than subtrahend')
    return
  }

  let minuendMM = Number(String(minuend).split('.')[1]) || 0 // hmm..
  const subtrahendMM = Number(String(subtrahend).split('.')[1]) || 0

  if (minuendMM < subtrahendMM) {
    minuendHH -= 1
    minuendMM += 60
  }

  const differenceHH = minuendHH - subtrahendHH
  const differenceMM = minuendMM - subtrahendMM

  if (differenceHH === 0) return `${differenceMM}min`

  return `${differenceHH}h ${differenceMM}min`
}

export const getDeparturesInternal = async (
  stations: { [key in StationName]: Station },
  trains: { [key in TrainId]: Train },
  from?: StationName,
  to?: StationName,
  serviceFrequency?: ServiceFrequency[],
  time?: TimeInput
) => {
  if (!stations)
    throw Error("filterData > departures(): argument 'stations' is missing")
  if (!from) {
    return {
      error: 'Departure station parameter is required',
    }
  }
  if (!to) {
    return {
      error: 'Arrival station parameter is required',
    }
  }
  if (
    (from && !Object.keys(stationNamesDisplayMap).includes(from)) ||
    (to && !Object.keys(stationNamesDisplayMap).includes(to))
  ) {
    return {
      error: 'Invalid departure and/or arrival station parameter',
    }
  }

  if (from && to && from === to) {
    return {
      error: 'Departure and arrival station must be different',
    }
  }
  if (!serviceFrequency) {
    return { error: 'Date parameter is required' }
  }
  if (!time) {
    return { error: 'Time parameter is required' }
  }
  // must be an array of 2 strings of ServiceFrequency type
  if (!Array.isArray(serviceFrequency) || serviceFrequency.length !== 2) {
    return { error: 'Invalid service frequency value' }
  }

  let checkedTrainsArray: TrainId[] = []

  const directArrivals = getDirectArrivals(
    stations,
    trains,
    from,
    to,
    serviceFrequency,
    time,
    checkedTrainsArray
  )

  if (!directArrivals.length) {
    checkedTrainsArray = []
  }
  // departures form the layover to destination station in the specified time frame
  const possibleLayovers = getLayoverStationAndArrivalTimes(
    stations,
    trains,
    from,
    to,
    serviceFrequency,
    time,
    checkedTrainsArray
  )

  if (!possibleLayovers.length) {
    return {
      departureStation: stationNamesDisplayMap[from],
      arrivalStation: stationNamesDisplayMap[to],
      departures: directArrivals, // this may be []
    }
  }

  const firstLayoverRecord = possibleLayovers[0]

  const layoverDepartures = getDirectArrivals(
    stations,
    trains,
    firstLayoverRecord.station,
    to,
    serviceFrequency,
    firstLayoverRecord.arrivalTime,
    checkedTrainsArray
  )

  const indirectArrivals: {
    departureTime: TimeInput
    arrivalTime: TimeInput
    trainId: TrainId
    layover: {
      station: StationName
      arrivalTime: TimeInput
      departureTime: TimeInput
      waitTime: string | undefined
      trainId: TrainId
    }
  }[] = []

  possibleLayovers.forEach((l) => {
    for (let j = 0; j <= layoverDepartures.length; j++) {
      // this ensures that we only get the trains in the right direction
      if (
        layoverDepartures[j] &&
        layoverDepartures[j].departureTime > l.arrivalTime
      ) {
        indirectArrivals.push({
          departureTime: l.departureTime,
          arrivalTime: layoverDepartures[j].arrivalTime,
          trainId: l.trainId,
          layover: {
            station: l.station,
            arrivalTime: l.arrivalTime,
            departureTime: layoverDepartures[j].departureTime,
            waitTime: subtractHHMM(
              layoverDepartures[j].departureTime,
              l.arrivalTime
            ),
            trainId: layoverDepartures[j].trainId,
          },
        })
        break // we only need the shortest layover duration
      }
    }
  })

  return {
    departureStation: stationNamesDisplayMap[from],
    arrivalStation: stationNamesDisplayMap[to],
    departures: [...directArrivals, ...indirectArrivals],
  }
}

export function isTimePatternValid(time: TimeInput) {
  const pattern = `^([0-1][0-9]|2[0-3])\\.([0-5][0-9])$`
  const r = new RegExp(pattern)
  return time.toString().match(r)
}

//______________________________________________________________________________________

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
      from: getStationNameDisplay(stations, departureStationIndex),
      to: getStationNameDisplay(stations, arrivalStationIndex),
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
  frequency: ('ed' | 'wd' | 'wh')[]
) {
  return departures.filter((departure: StationDepartureDetails) => {
    return (
      departure.time >= time &&
      departure.trainDetails.directionId === direction &&
      frequency.includes(departure.trainDetails.serviceFrequency)
    )
  })
}

/**
 * Converts a number into a time string.
 */
export function timeToString(time: number) {
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
    ? ['ed', 'wh']
    : ['ed', 'wd']
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
function getStationNameDisplay(stations: Station[], stationIndex: number) {
  return stations[stationIndex].nameDisplay
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
