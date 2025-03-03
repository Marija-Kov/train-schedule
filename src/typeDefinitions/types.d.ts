import {
  StationName,
  StationNameFormatted,
  TrainIdDirection1,
  TrainIdDirection2,
  Year,
  Month,
  Day,
  Hours,
  Minutes,
} from "./aliases";

export type Input = {
  from: StationName | undefined;
  to: StationName | undefined;
  date: YyyyMmDd | undefined;
  time: Time | undefined;
};

export type YyyyMmDd = `${Year}-${Month}-${Day}`;

export type Time = `${Hours}:${Minutes}` | "n/a";

export type DepartureProps = {
  departureTime: Time;
  arrivalTime: Time;
  trainId: TrainIdDirection1 | TrainIdDirection2;
};

export type ResultDeparture = DepartureProps & {
  from: StationNameFormatted;
  to: StationNameFormatted;
};

export type FormProps = {
  handleSetDepartures: (d: string | ResultDeparture[]) => void;
};

export type InfoProps = {
  toggleAppInfoVisibility: () => void;
};

export type StationDetails = {
  name: StationName;
  nameFormatted: StationNameFormatted;
  departures: StationDetailsDeparture[];
};

export type StationDetailsDeparture = {
  time: number;
  trainDetails: TrainDetails;
};

export type TrainDetails = {
  id: TrainIdDirection1 | TrainIdDirection2;
  directionId: DirectionId<
    TrainIdDirection1,
    TrainIdDirection2,
    TrainDetails["id"]
  >;
  activeOnWeekendsAndHolidays: boolean | "w&h_only";
};

type DirectionId<T1, T2, Id extends T1 | T2> = Id extends T1 ? 1 : 2;
