import { DepartureProps } from "train-schedule-types";

const Departure = (props: DepartureProps) => {
  const { departureTime, arrivalTime, trainId } = props;
  return (
    <div aria-label="departure" className="departure">
      <span aria-label="departure time">{departureTime}</span>
      <span aria-label="arrival time">{arrivalTime}</span>
      <span aria-label="train id number">{trainId}</span>
    </div>
  );
};

export default Departure;
