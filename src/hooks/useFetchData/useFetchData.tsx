const useFetchData = () => {
  const stationsUrl =
    'https://marija-kov.github.io/train-schedule-23-api/stations.json'
  const trainsUrl =
    'https://marija-kov.github.io/train-schedule-23-api/trains.json'
  const version = 5
  const stationsCacheName = `/trainScheduleBgd/stations-${version}`
  const trainsCacheName = `/trainScheduleBgd/trains-${version}`

  const fetchData = async () => {
    if (process.env.NODE_ENV === 'test') {
      try {
        const responseStations = await fetch(stationsUrl)
        if (!responseStations.ok) {
          console.error(`Could not fetch from url: ${stationsUrl}`)
          return
        }
        const responseTrains = await fetch(trainsUrl)
        if (!responseTrains.ok) {
          console.error(`Could not fetch from url: ${trainsUrl}`)
          return
        }
        const stationsJSON = await responseStations.json()
        const trainsJSON = await responseTrains.json()
        return { stationsJSON, trainsJSON }
      } catch (error) {
        console.error(error)
        return
      }
    }

    let stationsJSON = null
    let trainsJSON = null

    const stationsCache = await caches.open(stationsCacheName)
    const stationsData = await stationsCache.match(stationsCacheName)

    if (stationsData) {
      stationsJSON = await stationsData.json()
    } else {
      const responseStations = await fetch(stationsUrl)
      if (!responseStations.ok) {
        console.error(`Could not fetch from url: ${stationsUrl}`)
        return
      }
      const oldVersions = await caches.keys()
      oldVersions.forEach(
        (v) =>
          v.match(/stations/i) && v !== stationsCacheName && caches.delete(v)
      )
      stationsCache.put(stationsCacheName, responseStations.clone())
    }

    const trainsCache = await caches.open(trainsCacheName)
    const trainsData = await trainsCache.match(trainsCacheName)

    if (trainsData) {
      trainsJSON = await trainsData.json()
    } else {
      const responseTrains = await fetch(trainsUrl)
      if (!responseTrains.ok) {
        console.error(`Could not fetch from url: ${stationsUrl}`)
        return
      }
      const oldVersions = await caches.keys()
      oldVersions.forEach(
        (v) => v.match(/trains/i) && v !== trainsCacheName && caches.delete(v)
      )
      trainsCache.put(trainsCacheName, responseTrains.clone())
    }

    return { stationsJSON, trainsJSON }
  }
  return { fetchData }
}

export default useFetchData
