export type Station = string | undefined;

export type TrainId = 7101 | 7901 | 8001 | 8005 | 8201 | 8007 | 8011 | 8013 | 8015 | 8017 | 8019 | 8203 | 8021 | 8023 | 8025 | 8029 | 8033 | 8035 | 8037 | 8039 | 7113 | 8041 | 8043 | 7905 | 8045 | 8047 | 8049 | 8051 | 8053 | 8000 | 7900 | 8002 | 8004 | 8006 | 8010 | 8012 | 8014 | 8200 | 8016 | 8310 | 8018 | 8020 | 8022 | 8024 | 8026 | 8030 | 7108 | 8034 | 8036 | 8038 | 7110 | 8040 | 8042 | 8044 | 8046 | 8048 | 8202 | 8050 | 7114 | 8052 | 8054 | 7116 | 8208 | 8056 | 8340;

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
  itinerary: { station: string, time: number }[]
}

