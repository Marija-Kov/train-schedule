import { useState } from 'react'
import Form from './components/Form'
import Departure from './components/Departure'

function App() {
 const [departures, setDepartures] = useState([]);
 const [route, setRoute] = useState(null)

 const runSetDepartures = (d) => {
  setDepartures(() => d)
 }

 const runSetRoute = (from, to) => {
  setRoute({from: from, to: to})
 }

  return (
    <div className="container">
      <header>
        <span>&#10210;</span>
       <a href="">
        <img 
        className="train-icon"
        src="src/assets/train-icon.png"/>
       </a> 
       <span>
        <button className="info">?</button>
       </span>
      </header>
      
      {!departures.length && 
      <Form 
       runSetRoute={runSetRoute}
       runSetDepartures={runSetDepartures}
       />}
      {departures.length ? 
       <div className="departures--container">
        <h2>
          <span>
           {route.from}
          </span>
          <span>
           {route.to}
          </span>
        </h2> 
        <h3>
          <span>polazak</span>
          <span>dolazak</span>
          <span>br. voza</span>
        </h3>
        {departures.map(d => (
          <Departure
           key={d.trainId}
           from={d.from}
           to={d.to}
           departureTime={d.departureTime}
           arrivalTime={d.arrivalTime}
           trainId={d.trainId}
          />
        ))}
         <button 
          aria-label="back to search form"
          className="back"
          onClick={() => runSetDepartures([])}>
           nazad na pretragu
         </button> 
        </div> : null
      }

    </div>
  )
}

export default App
