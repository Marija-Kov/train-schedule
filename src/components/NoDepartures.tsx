import { useContext } from "react"
import { LanguageContext } from "../context/LanguageContext"

const NoDepartures = () => {
  const { noDeparturesLanguage } = useContext(LanguageContext);
  return (
    <>
      <p>⚠</p>
      <p data-testid="no-departures-message">{noDeparturesLanguage.no_departures_message}</p>
    </>
  )
}

export default NoDepartures
