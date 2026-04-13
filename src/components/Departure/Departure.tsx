import {
  DepartureProps,
  StationName,
  TimeInput,
  TrainId,
} from 'train-schedule-types'

type NewDepartureProps = DepartureProps & {
  layover: {
    station: StationName
    arrivalTime: TimeInput
    departureTime: TimeInput
    waitTime: string | undefined
    trainId: TrainId
  } | null
}

const Departure = (props: NewDepartureProps) => {
  const { departureTime, arrivalTime, trainId, layover } = props
  console.log(trainId, layover)

  return (
    <div data-testid="search-result-row" className="departure">
      <span data-testid="departure-time-cell">{departureTime}</span>
      <span data-testid="arrival-time-cell">{arrivalTime}</span>
      <span data-testid="train-no-cell">{trainId}</span>
    </div>
  )
}

export default Departure
