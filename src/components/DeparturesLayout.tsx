import { useContext } from "react";
import { useNavigate, useParams } from "react-router"
import { StationName } from "train-schedule-types";
import Departure from "./Departure";
import NoDepartures from "./NoDepartures";
import { DeparturesContext } from "../context/DeparturesContext";
import { LanguageContext } from "../context/LanguageContext";
import useTrainServiceUpdates from "../hooks/useTrainServiceUpdates/useTrainServiceUpdates";

function DeparturesLayout() {
  const navigate = useNavigate();
  const params = useParams();
  const { departures, loading } = useContext(DeparturesContext);
  const { departuresLayoutLanguage } = useContext(LanguageContext);

  const { updates, loadingUpdates } = useTrainServiceUpdates();

  const stationNamesMap = {
    batajnica: "Batajnica",
    kamendin: "Kamendin",
    "zemunsko polje": "Zemunsko polje",
    altina: "Altina",
    zemun: "Zemun",
    "tosin bunar": "Tošin bunar",
    "novi beograd": "Novi Beograd",
    "beograd centar": "Beograd centar",
    "karadjordjev park": "Karađorđev park",
    "vukov spomenik": "Vukov spomenik",
    "pancevacki most": "Pančevački most",
    "krnjaca most": "Krnjača most",
    "krnjaca ukr": "Krnjača ukr.",
    sebes: "Sebeš",
    ovca: "Ovča"
  }

  return (
    <div className="departures--container">
      <h2>
        <span data-testid="departure-station-name">{stationNamesMap[params.from as StationName]}</span>
        <span>➞</span>
        <span data-testid="arrival-station-name">{stationNamesMap[params.to as StationName]}</span>
      </h2>
      <h3>
        <span data-testid="departure-title">{departuresLayoutLanguage.departure_time_title}</span>
        <span data-testid="arrival-title">{departuresLayoutLanguage.arrival_time_title}</span>
        <span data-testid="train-no-title">{departuresLayoutLanguage.train_number_title}</span>
      </h3>
      {loading ? <h1 data-testid="loader">{departuresLayoutLanguage.loading_message}...</h1> : <>
        {departures?.length ?
          departures.map(d => {
            return (
              <Departure
                key={d.trainId}
                departureTime={d.departureTime}
                arrivalTime={d.arrivalTime}
                trainId={d.trainId} />
            )
          }) : <NoDepartures />}
        {loadingUpdates ? <p>{departuresLayoutLanguage.loading_message}...</p> :
          typeof updates === "string" && updates === "Data not available" ?
            <p className="service-updates-not-available">
              {departuresLayoutLanguage.service_updates_not_available}
            </p> :
            updates.length ? updates.map(u => {
              return (
                <p className="service-update-details">{u}</p>
              )
            }) : <p>{departuresLayoutLanguage.on_schedule}</p>
        }

        <button
          onClick={() => navigate(-1)}
          data-testid="back-to-form"
          className="back"
        >
          {departuresLayoutLanguage.back_btn_text}
        </button>
      </>
      }
    </div>
  );
}

export default DeparturesLayout;