import { useContext } from "react";
import { useNavigate, useParams } from "react-router"
import { StationName } from "train-schedule-types";
import Departure from "./Departure";
import NoDepartures from "./NoDepartures";
import { DeparturesContext } from "../context/DeparturesContext";
import { LanguageContext } from "../context/LanguageContext";

function DeparturesLayout() {
  const navigate = useNavigate();
  const params = useParams();
  const { departures, loading } = useContext(DeparturesContext);
  const { departuresLayoutLanguage } = useContext(LanguageContext);

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
        <span aria-label="route start">{stationNamesMap[params.from as StationName]}</span>
        <span>➞</span>
        <span aria-label="route end">{stationNamesMap[params.to as StationName]}</span>
      </h2>
      <h3>
        <span>{departuresLayoutLanguage.departure_time_title}</span>
        <span>{departuresLayoutLanguage.arrival_time_title}</span>
        <span>{departuresLayoutLanguage.train_number_title}</span>
      </h3>
      {loading ? <h1>{departuresLayoutLanguage.loading_message}...</h1> : <>
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
        <button
          onClick={() => navigate(-1)}
          aria-label="back to search form"
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