import { SetStateAction, useState } from "react";
import Form from "./components/Form";
import Departure from "./components/Departure";
import Info from "./components/Info";
import { ResultDeparture } from "./typeDefinitions/types";

function App() {
  const [departures, setDepartures] = useState<ResultDeparture[] | string>(
    []
  );
  const [appInfo, setAppInfo] = useState(false);

  const runSetDepartures = (
    d: SetStateAction<ResultDeparture[] | string>
  ) => {
    setDepartures(d);
  };

  const runSetAppInfo = () => {
    setAppInfo((prev) => !prev);
  };

  const showData = () => {
    if (typeof departures === "object" && departures.length) {
      return (
        <div className="departures--container">
          <h2>
            <span aria-label="route start">{departures[0].from}</span>
            <span aria-label="route end">{departures[0].to}</span>
          </h2>
          <h3>
            <span>polazak</span>
            <span>dolazak</span>
            <span>br. voza</span>
          </h3>
          {departures.map((d) => (
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
            onClick={() => runSetDepartures([])}
          >
            nazad
          </button>
        </div>
      );
    }
    if (typeof departures === "string") {
      return (
        <div className="no-departures">
          <p>⚠</p>
          <p>Nema polazaka po tim parametrima</p>
          <p>/</p>
          <p>No departures found</p>
          <button
            aria-label="back to search form"
            className="back"
            onClick={() => runSetDepartures([])}
          >
            nazad
          </button>
        </div>
      );
    }
    return "";
  };

  return (
    <div className="container">
      <header>
        <span>&#10210;</span>
        <a href="">
          <img className="train-icon" src="/train-icon.png" />
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
      {appInfo && <Info runSetAppInfo={runSetAppInfo} />}
      <Form runSetDepartures={runSetDepartures} />
      {showData()}
    </div>
  );
}

export default App;
