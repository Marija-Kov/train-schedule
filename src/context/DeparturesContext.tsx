import { createContext, useState, ReactNode, useEffect } from 'react'
import { useParams } from 'react-router'
import {
  DepartureOutput,
  DepartureProps,
  StationName,
  TimeOutput,
  YyyyMmDd,
} from 'train-schedule-types'
import useGetDepartures from '../hooks/useGetDepartures/useGetDepartures'

const DeparturesContext = createContext<{
  departures: DepartureOutput[]
  loading: boolean
}>({
  departures: [],
  loading: true,
})

const DeparturesContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const params = useParams()
  const { getDepartures } = useGetDepartures()
  const [departures, setDepartures] = useState<DepartureProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function handleGetDepartures() {
      setLoading(true)
      let result
      try {
        result = await getDepartures({
          from: params.from?.toLowerCase() as StationName,
          to: params.to?.toLowerCase() as StationName,
          date: params.date as YyyyMmDd,
          time: params.time as TimeOutput,
        })
        if (Array.isArray(result) && result.length) {
          setDepartures(result)
        } else {
          setDepartures([])
        }
      } catch (error) {
        console.log(error)
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 500)
      }
    }
    handleGetDepartures()
  }, [params])

  return (
    <DeparturesContext.Provider value={{ departures, loading }}>
      {children}
    </DeparturesContext.Provider>
  )
}

export { DeparturesContext, DeparturesContextProvider }
