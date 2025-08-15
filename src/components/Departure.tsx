import { DepartureProps } from "train-schedule-types";

const Departure = (props: DepartureProps) => {
  const { departureTime, arrivalTime, trainId } = props;
  return (
    <div data-testid="search-result-row" className="departure">
      <span data-testid="departure-time-cell">{departureTime}</span>
      <span data-testid="arrival-time-cell">{arrivalTime}</span>
      <span data-testid="train-no-cell">{trainId}</span>
    </div>
  );
};

export default Departure;
