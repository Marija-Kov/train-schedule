import { useContext, useState } from 'react'
import { DepartureProps } from 'train-schedule-types'
import { LanguageContext } from '../../context'

const Departure = (props: DepartureProps) => {
  const { departureTime, arrivalTime, trainId, transfer } = props
  const [transferDetails, setTransferDetails] = useState(false)
  const { departuresLayoutLanguage } = useContext(LanguageContext)

  function toggleTransferDetails() {
    if (!transfer) return
    if (!transferDetails) {
      setTransferDetails(true)
    } else {
      setTransferDetails(false)
    }
  }

  return (
    <>
      <div
        data-testid="search-result-row"
        className={
          transfer
            ? transferDetails
              ? 'departure transfer-details-shown'
              : 'departure transfer-details-hidden'
            : 'departure'
        }
        onClick={toggleTransferDetails}
      >
        <span data-testid="departure-time-cell">{departureTime}</span>
        <span data-testid="arrival-time-cell">{arrivalTime}</span>
        <span data-testid="train-no-cell">
          {trainId}
          {transfer && ` ➞ ${transfer.trainId}`}
        </span>
      </div>
      {transferDetails && (
        <div
          data-testid="transfer-details"
          className="transfer-details"
          onClick={toggleTransferDetails}
        >
          <p>
            {transfer?.arrivalTime} -{' '}
            {departuresLayoutLanguage.transfer_arrival} ({transfer!.station})
          </p>
          <p>
            {transfer?.departureTime} -{' '}
            {departuresLayoutLanguage.transfer_departure}
          </p>
        </div>
      )}
    </>
  )
}

export default Departure
