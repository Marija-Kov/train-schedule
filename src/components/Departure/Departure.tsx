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
        className={
          layover
            ? layoverDetails
              ? 'departure layover-details-shown'
              : 'departure layover-details-hidden'
            : 'departure'
        }
        onClick={toggleLayoverDetails}
      >
        <span data-testid="departure-time-cell">{departureTime}</span>
        <span data-testid="arrival-time-cell">{arrivalTime}</span>
        <span data-testid="train-no-cell">
          {trainId}
          {layover && ` ➞ ${layover.trainId}`}
        </span>
      </div>
      {layoverDetails && (
        <div
          data-testid="layover-details"
          className="layover-details"
          onClick={toggleLayoverDetails}
        >
          <p>
            {layover?.arrivalTime} - dolazak na stanicu presedanja (
            {layover!.station})
          </p>
          <p>{layover?.departureTime} - polazak sa stanice presedanja</p>
        </div>
      )}
    </>
  )
}

export default Departure
