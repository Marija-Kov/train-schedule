import { SetStateAction, useState } from "react";
import Form from "./components/Form";
import Departure from "./components/Departure";
import Info from "./components/Info";
import { DepartureProps, DeparturesResponseBody } from "train-schedule-types";
import { hasError } from "./types/typeGuards";

function App() {
  const [result, setResult] = useState<DeparturesResponseBody>({
    departureStation: "Batajnica",
    arrivalStation: "Altina",
    departures: [],
  });
  const [appInfo, setAppInfo] = useState(false);

  const handleSetDepartures = (d: SetStateAction<DeparturesResponseBody>) => {
    setResult(d);
  };

  const toggleAppInfoVisibility = () => {
    setAppInfo((prev) => !prev);
  };

  const showDepartures = () => {
    if (hasError(result)) {
      return (
        <div className="no-departures">
          <p>⚠</p>
          <p>Nema polazaka po tim parametrima</p>
          <p>/</p>
          <p>No departures found</p>
          <button
            aria-label="back to search form"
            className="back"
            onClick={() =>
              handleSetDepartures({
                departureStation: "Batajnica",
                arrivalStation: "Altina",
                departures: [],
              })
            }
          >
            nazad
          </button>
        </div>
      );
    } else if (result.departures.length) {
      const departures = result.departures;
      return (
        <div className="departures--container">
          <h2>
            <span aria-label="route start">{result.departureStation}</span>
            <span aria-label="route end">{result.arrivalStation}</span>
          </h2>
          <h3>
            <span>polazak</span>
            <span>dolazak</span>
            <span>br. voza</span>
          </h3>
          {departures.map((d: DepartureProps) => (
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
            onClick={() =>
              handleSetDepartures({
                departureStation: "Batajnica",
                arrivalStation: "Altina",
                departures: [],
              })
            }
          >
            nazad
          </button>
        </div>
      );
    } else {
      return "";
    }
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
            onClick={toggleAppInfoVisibility}
            className="info"
          >
            ?
          </button>
        </span>
      </header>
      {appInfo && <Info toggleAppInfoVisibility={toggleAppInfoVisibility} />}
      <Form handleSetDepartures={handleSetDepartures} />
      {showDepartures()}
    </div>
  );
}

export default App;
