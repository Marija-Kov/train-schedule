import PropTypes from "prop-types";

const Departure = ({ departureTime, arrivalTime, trainId}) => {
  return (
    <div aria-label="departure" className="departure">
      <span aria-label="departure time">{departureTime}--</span>
      <span aria-label="arrival time">{arrivalTime}--</span>
      <span aria-label="train id number">{trainId}</span>
    </div>
  )
}

Departure.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
  departureTime: PropTypes.string.isRequired,
  arrivalTime: PropTypes.string.isRequired,
  trainId: PropTypes.number.isRequired
}

export default Departure;