import { useState } from 'react'
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
  const [layoverDetails, setLayoverDetails] = useState(false)

  function toggleLayoverDetails() {
    if (!layoverDetails) {
      setLayoverDetails(true)
    } else {
      setLayoverDetails(false)
    }
  }

  return (
    <>
      <div
        data-testid="search-result-row"
        className="departure"
        onClick={toggleLayoverDetails}
      >
        {layover && (
          <button data-testid="layover-toggle-button">Layover!</button>
        )}
        <span data-testid="departure-time-cell">{departureTime}</span>
        <span data-testid="arrival-time-cell">{arrivalTime}</span>
        <span data-testid="train-no-cell">
          {trainId}
          {layover && `->${layover.trainId}`}
        </span>
      </div>
      {layoverDetails && (
        <div data-testid="layover-details" className="layover-details">
          <p>
            take {trainId} from departure st. to {layover?.station}
          </p>
          <p>
            arrive to {layover?.station} at {layover?.arrivalTime}
          </p>
          <p>wait {layover?.waitTime}</p>
          <p>
            take {layover?.trainId} from {layover?.station} at{' '}
            {layover?.departureTime}
          </p>
          <p>arrive to destination st. at {arrivalTime}</p>
        </div>
      )}
    </>
  )
}

export default Departure
