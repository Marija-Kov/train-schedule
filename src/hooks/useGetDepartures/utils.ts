import {
  TimeOutput,
  YyyyMmDd,
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
  departureTime: TimeOutput
  arrivalTime: TimeOutput
  trainId: TrainId
  transfer: {
    station: StationName
    arrivalTime: TimeOutput
    departureTime: TimeOutput
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
            departureTime: timeToString(d.time),
            arrivalTime: timeToString(i.time),
            trainId: trainId,
            transfer: null, // for all direct arrivals
          }
        }),
    ]
  })
  return result.filter(
    (e) =>
      e !== undefined &&
      timeToNumber(e.departureTime) < timeToNumber(e.arrivalTime)
  )
}

const getTransferStationAndArrivalTimes = (
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
        .filter((i) => i.station === 'karadjordjev park') // karadjordjev park is a transfer station for all train lines
        .map((i) => {
          checkedTrainsArray.push(trainId)
          return {
            station: i.station,
            departureTime: timeToString(d.time),
            arrivalTime: timeToString(i.time),
            trainId: trainId,
          }
        }),
    ]
  })
  return result.filter(
    (e) =>
      e !== undefined &&
      timeToNumber(e.departureTime) < timeToNumber(e.arrivalTime)
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
  // departures from the transfer to destination station in the specified time frame
  const possibleTransfers = getTransferStationAndArrivalTimes(
    stations,
    trains,
    from,
    to,
    serviceFrequency,
    time,
    checkedTrainsArray
  )

  if (!possibleTransfers.length) {
    return {
      departureStation: stationNamesDisplayMap[from],
      arrivalStation: stationNamesDisplayMap[to],
      departures: directArrivals, // this may be []
    }
  }

  const firstTransferRecord = possibleTransfers[0]

  const transferDepartures = getDirectArrivals(
    stations,
    trains,
    firstTransferRecord.station,
    to,
    serviceFrequency,
    timeToNumber(firstTransferRecord.arrivalTime).toString() as TimeInput,
    checkedTrainsArray
  )

  const indirectArrivals: {
    departureTime: TimeOutput
    arrivalTime: TimeOutput
    trainId: TrainId
    transfer: {
      station: StationName
      arrivalTime: TimeOutput
      departureTime: TimeOutput
      waitTime: string | undefined
      trainId: TrainId
    }
  }[] = []

  possibleTransfers.forEach((l) => {
    for (let j = 0; j <= transferDepartures.length; j++) {
      // this ensures that we only get the trains in the right direction
      if (
        transferDepartures[j] &&
        timeToNumber(transferDepartures[j].departureTime) >
          timeToNumber(l.arrivalTime)
      ) {
        indirectArrivals.push({
          departureTime: l.departureTime,
          arrivalTime: transferDepartures[j].arrivalTime,
          trainId: l.trainId,
          transfer: {
            station: l.station,
            arrivalTime: l.arrivalTime,
            departureTime: transferDepartures[j].departureTime,
            waitTime: subtractHHMM(
              timeToNumber(
                transferDepartures[j].departureTime
              ).toString() as TimeInput,
              timeToNumber(l.arrivalTime).toString() as TimeInput
            ),
            trainId: transferDepartures[j].trainId,
          },
        })
        break // we only need the shortest transfer duration
      }
    }
  })

  // Remove redundant indirect arrivals:
  const checkedTransferTrainIds: TrainId[] = []

  for (let j = indirectArrivals.length - 1; j >= 0; j--) {
    if (
      checkedTransferTrainIds.includes(indirectArrivals[j].transfer.trainId)
    ) {
      indirectArrivals.splice(j, 1)
    } else {
      checkedTransferTrainIds.push(indirectArrivals[j].transfer.trainId)
    }
  }

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
 * @returns An array of 2 strings: ['ed', 'wh'] or ['ed', 'wd'].
 * Meanings of abbreviations: 'ed' - 'every day'; 'wd' - 'weekday'; 'wh' - 'weekend and holiday';
 * ['ed', 'wh'] - denotes a set of trains that are active every day and those that are active only on weekends and holidays.
 * ['ed', 'wd'] - denotes a set of trains that are active every day and those that are active only on weekdays.
 */
export function frequencyOnDate(date: YyyyMmDd, holidays: YyyyMmDd[]) {
  const day = new Date(date).getDay()
  return day === 0 || day === 6 || holidays.includes(date)
    ? ['ed', 'wh']
    : ['ed', 'wd']
}
