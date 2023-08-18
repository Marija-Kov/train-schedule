import { SetStateAction, useState } from 'react'
import Form from './components/Form'
import Departure from './components/Departure'
import Info from './components/Info'
import { stations, stationsFormatted } from './data/timetable'
import { Departure as DepartureType } from './types'

function App() {
 const [departures, setDepartures] = useState<DepartureType[] | string>([]);
 const [route, setRoute] = useState({from: "", to: ""});
 const [appInfo, setAppInfo] = useState(false);

 const runSetDepartures = (d: SetStateAction<DepartureType[] | string>) => {
  setDepartures(d)
 }

 const runSetRoute = (from: string, to: string) => {
  setRoute({from: stationsFormatted[stations.indexOf(from)], to: stationsFormatted[stations.indexOf(to)]})
 }

 const runSetAppInfo = () => {
  setAppInfo(prev => !prev)
 }

  return (
    <div className="container">
      <header>
        <span>&#10210;</span>
       <a href="">
        <img 
        className="train-icon"
        src="/train-icon.png"/>
       </a> 
       <span>
        <button 
        aria-label="more info"
        onClick={runSetAppInfo}
        className="info"
        >
          ?
        </button>
       </span>
      </header>

      {appInfo && <Info runSetAppInfo={runSetAppInfo}/>}     
      <Form 
       runSetRoute={runSetRoute}
       runSetDepartures={runSetDepartures}
       />
      {typeof departures === "object" && departures.length ?      
       <div className="departures--container">
        <h2>
          <span aria-label="route start">
           {route.from}
          </span>
          <span aria-label="route end">
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
        </div> : (
          typeof departures === "string" ?
        <div className="no-departures">
          <p>⚠</p>
          Nema polazaka po tim parametrima!
        </div> : null     
        )

      }

    </div>
  )
}

export default App
