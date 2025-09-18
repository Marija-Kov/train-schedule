import { DepartureOutput, FormInputData } from 'train-schedule-types'
import useFetchData from '../useFetchData/useFetchData'
import {
  frequencyOnDate,
  stationIndex,
  filterDepartures,
  timeToNumber,
  direction,
  transformToReturnFormat,
  getResult,
} from './utils'

const useGetDepartures = () => {
  const { fetchData } = useFetchData()

  const getDepartures = async (
    input: FormInputData
  ): Promise<DepartureOutput[] | string> => {
    if (!input.from || !input.to || !input.date || !input.time)
      return 'All fields must be filled'

    if (input.from === input.to) return []

    const data = await fetchData()
    const stations = data.stations
    const frequency = frequencyOnDate(input.date, data.holidays)
    const indexFrom = stationIndex(stations, input.from)
    const indexTo = stationIndex(stations, input.to)

    const possibleDepartures = filterDepartures(
      stations[indexFrom].departures,
      timeToNumber(input.time),
      direction(indexFrom, indexTo),
      frequency
    )

    if (!possibleDepartures.length) return []

    const possibleDeparturesEnriched = transformToReturnFormat(
      possibleDepartures,
      stations,
      indexFrom,
      indexTo
    )

    const possibleArrivals = filterDepartures(
      stations[indexTo].departures,
      timeToNumber(input.time),
      direction(indexFrom, indexTo),
      frequency
    )

    return getResult(possibleDeparturesEnriched, possibleArrivals)
  }

  return { getDepartures }
}

export default useGetDepartures
