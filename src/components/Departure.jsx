
const Departure = ({ from, to, departureTime, arrivalTime, trainId}) => {
  return (
    <div className="departure">
      <span>{departureTime}--</span>
      <span>{arrivalTime}--</span>
      <span>{trainId}</span>
    </div>
  )
}

export default Departure;