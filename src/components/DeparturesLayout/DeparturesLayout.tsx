import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router'
import { StationName } from 'train-schedule-types'
import { Departure, NoDepartures, TrainServiceUpdates } from '../'
import { DeparturesContext, LanguageContext } from '../../context'

function DeparturesLayout() {
  const navigate = useNavigate()
  const params = useParams()
  const { departures, loading } = useContext(DeparturesContext)
  const { departuresLayoutLanguage } = useContext(LanguageContext)

  const stationNamesMap = {
    batajnica: 'Batajnica',
    kamendin: 'Kamendin',
    'zemunsko polje': 'Zemunsko polje',
    altina: 'Altina',
    zemun: 'Zemun',
    'tosin bunar': 'Tošin bunar',
    'novi beograd': 'Novi Beograd',
    'beograd centar': 'Beograd centar',
    'karadjordjev park': 'Karađorđev park',
    'vukov spomenik': 'Vukov spomenik',
    'pancevacki most': 'Pančevački most',
    'krnjaca most': 'Krnjača most',
    'krnjaca ukr': 'Krnjača ukr.',
    sebes: 'Sebeš',
    ovca: 'Ovča',
    rakovica: 'Rakovica',
    knezevac: 'Kneževac',
    kijevo: 'Kijevo',
    resnik: 'Resnik',
    lazarevac: 'Lazarevac',
    vreoci: 'Vreoci',
    stepojevac: 'Stepojevac',
    'leskovac kolubarski': 'Leskovac Kolubarski',
    'veliki borak': 'Veliki Borak',
    'barajevo centar': 'Barajevo Centar',
    'barajevo ukr': 'Barajevo ukr.',
    'bela reka': 'Bela reka',
    mladenovac: 'Mladenovac',
    ripanj: 'Ripanj',
    'ripanj kolonija': 'Ripanj kolonija',
    'ripanj tunel': 'Ripanj tunel',
    klenje: 'Klenje',
    ralja: 'Ralja',
    'sopot kosmajski': 'Sopot Kosmajski',
    'vlasko polje': 'Vlaško Polje',
  }

  return (
    <div className="departures--container">
      <h2>
        <span data-testid="departure-station-name">
          {stationNamesMap[params.from as StationName]}
        </span>
        <span>➞</span>
        <span data-testid="arrival-station-name">
          {stationNamesMap[params.to as StationName]}
        </span>
      </h2>
      <h3>
        <span data-testid="departure-title">
          {departuresLayoutLanguage.departure_time_title}
        </span>
        <span data-testid="arrival-title">
          {departuresLayoutLanguage.arrival_time_title}
        </span>
        <span data-testid="train-no-title">
          {departuresLayoutLanguage.train_number_title}
        </span>
      </h3>
      {loading ? (
        <h1 data-testid="loader">
          {departuresLayoutLanguage.loading_message}...
        </h1>
      ) : (
        <>
          {departures?.length ? (
            departures.map((d) => {
              return (
                <Departure
                  key={d.trainId}
                  departureTime={d.departureTime}
                  arrivalTime={d.arrivalTime}
                  trainId={d.trainId}
                  layover={d.layover}
                />
              )
            })
          ) : (
            <NoDepartures />
          )}
          <TrainServiceUpdates />
          <button
            onClick={() => navigate(-1)}
            data-testid="back-to-form"
            className="back"
          >
            {departuresLayoutLanguage.back_btn_text}
          </button>
        </>
      )}
    </div>
  )
}

export default DeparturesLayout
