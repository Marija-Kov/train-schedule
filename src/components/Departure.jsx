
const Departure = ({ from, to, departureTime, arrivalTime, trainId}) => {
  return (
    <div aria-label="departure" className="departure">
      <span aria-label="departure time">{departureTime}--</span>
      <span aria-label="arrival time">{arrivalTime}--</span>
      <span aria-label="train id number">{trainId}</span>
    </div>
  )
}

export default Departure;