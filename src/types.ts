export type Station = string | undefined;

export type TrainId = number;

export type Input = {
    from: Station,
    to: Station,
    date: string | undefined, 
    time: string | undefined
  }

export type DepartureProps = {
      departureTime: string,
      arrivalTime: string,
      trainId: TrainId
    }

export type DepartureReturned = DepartureProps & {
    from: Station,
    to: Station,
}

export type FormProps = {
    runSetDepartures: (d: string | DepartureReturned[]) => void,
  }

export type InfoProps = {
    runSetAppInfo: () => void
  }

export type StationDetails = {
  name: string,
  nameFormatted: string,
  departures: StationDeparture[]
}

export type StationDeparture = {
  time: number, trainDetails: TrainDetails
}

export type TrainDetails = {
  id: TrainId,
  directionId: 1 | 2,
  activeOnWeekendsAndHolidays: boolean | "w&h_only",
}

