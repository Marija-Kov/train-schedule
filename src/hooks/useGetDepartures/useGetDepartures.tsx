import { FormInputData, TimeInput } from 'train-schedule-types'
import useFetchData from '../useFetchData/useFetchData'
import { frequencyOnDate, timeToNumber, getDeparturesInternal } from './utils'

const useGetDepartures = () => {
  const { fetchData } = useFetchData()

  const getDepartures = async (input: FormInputData) => {
    if (!input.from || !input.to || !input.date || !input.time)
      return 'All fields must be filled'

    if (input.from === input.to) return []

    const data = await fetchData()

    const frequency = frequencyOnDate(
      input.date,
      data?.stationsJSON.holidays
    ) as ('ed' | 'wd' | 'wh')[]

    const timeInput = timeToNumber(input.time).toString()

    const newResult = await getDeparturesInternal(
      data?.stationsJSON.stations,
      data?.trainsJSON,
      input.from,
      input.to,
      frequency,
      timeInput as TimeInput
    )

    return newResult.departures
  }

  return { getDepartures }
}

export default useGetDepartures
