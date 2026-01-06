import { useEffect, useState } from 'react'
import { TimeOutput } from 'train-schedule-types'

type TrainServiceUpdateTokens = {
  from: string
  to: string
  time: TimeOutput
  omitsARouteSegment?: null | string
}

type TrainServiceUpdateObject = {
  id: number
  tokens: TrainServiceUpdateTokens
  link: string
}

const useTrainServiceUpdates = () => {
  const stationNamesCaseVariations = [
    'Batajnica',
    'Batajnice',
    'Batajnicu',
    'Kamendina',
    'Kamendin',
    'Zemunsko polje',
    'Zemunskog polja',
    'Altina',
    'Altine',
    'Altinu',
    'Zemuna',
    'Zemunu',
    'Zemun',
    'Tošin bunar',
    'Tošinog bunara',
    'Novi Beograd',
    'Novog Beograda',
    'Beograd centar',
    'Beograd centra',
    'Karađorđev park',
    'Karađorđevog parka',
    'Vukov spomenik',
    'Vukovog spomenika',
    'Pančevački most',
    'Pančevačkog mosta',
    'Krnjača most',
    'Krnjača ukr',
    'Sebeša',
    'Sebešu',
    'Sebeš',
    'Ovča',
    'Ovče',
    'Ovču',
    'Resnika',
    'Resnik',
    'Lazarevca',
    'Lazarevac',
    'Mladenovca',
    'Mladenovac',
  ]
  const [updates, setUpdates] = useState<TrainServiceUpdateObject[]>([])
  const [loadingUpdates, setLoadingUpdates] = useState(false)

  const trainServiceUpdates = async () => {
    setLoadingUpdates(true)
    const currentDateTime = new Date().toISOString().split('.')[0]
    const currentDate = currentDateTime.split('T')[0]
    const serviceUpdateObjects: TrainServiceUpdateObject[] = []

    const response = await fetch(
      'https://www.srbvoz.rs/wp-json/wp/v2/info_post?per_page=50'
    )
    if ([500, 404, 403, 401].includes(response.status) || !response.ok) {
      // @ts-expect-error TODO: investigate the issue with updates state type
      setUpdates('Data not available')
      setLoadingUpdates(false)
      return
    }

    const data = await response.json()

    /*
     Parse service update strings    
    */
    data
      .filter(
        (update: {
          date: string
          slug: string
          content: { rendered: string }
        }) => {
          const updateDate = update.date.split('T')[0]
          return updateDate === currentDate && update.slug.match(/bgvoz/i)
        }
      )
      .map(
        (update: { id: number; link: string; content: { rendered: string } }) =>
          serviceUpdateObjects.push(
            ...filterTokensAndCreateServiceUpdateObjectsArray(
              extractTokens(
                update.content.rendered.split('\n')[1].slice(3, -4)
              ),
              update.id,
              update.link
            )
          )
      )

    function extractTokens(string: string) {
      return (
        string
          .match(
            new RegExp(
              `\\b(${stationNamesCaseVariations.join('|')})\\b|\\d{2}[:,.]\\d{2}`,
              'g'
            )
          )
          ?.toString()
          .split(',')
          .map((token) => normalizeStationName(token)) || []
      )
    }

    function normalizeStationName(name: string) {
      if (name.match(/Bataj/)) return 'Batajnica'
      if (name.match(/Kamend/)) return 'Kamendin'
      if (name.match(/Zemunsk/)) return 'Zemunsko polje'
      if (name.match(/Altin/)) return 'Altina'
      if (name.match(/Zemun/)) return 'Zemun'
      if (name.match(/Tošin/)) return 'Tošin bunar'
      if (name.match(/Nov/) && name.match(/Beo/)) return 'Novi Beograd'
      if (name.match(/Beo/) && name.match(/cent/i)) return 'Beograd centar'
      if (name.match(/Karađ/)) return 'Karađorđev park'
      if (name.match(/Vukov/)) return 'Vukov spomenik'
      if (name.match(/Pančevač/)) return 'Pančevački most'
      if (name.match(/Krnjač/) && name.match(/most/)) return 'Krnjača most'
      if (name.match(/Krnjač/) && name.match(/ukr/)) return 'Krnjača ukr.'
      if (name.match(/Sebeš/)) return 'Sebeš'
      if (name.match(/Ovč/)) return 'Ovča'
      return name
    }

    function groupTokens(tokens: string[]) {
      const tokenGroups: string[][] = []
      let aTokenGroup = [] // consists of 2 station tokens followed by at least one time token possibly followed by another pair of station tokens
      let i = 0
      while (tokens[i]) {
        aTokenGroup.push(tokens[i])
        i++
        aTokenGroup.push(tokens[i])
        i++
        while (tokens[i] && tokens[i].match(/\d{2}[:,.]\d{2}/)) {
          aTokenGroup.push(tokens[i])
          i++
        }
        /*
          When to push another pair of station(st) tokens after a sequence of time tokens into a group?

          Possible tokens array iteration states once a sequence of time tokens is pushed into a group
          (relevant states marked with X):
          
          idx:         (i) (i+1) (i+2)
       1. X [..., time, st,  st,  st, ...] - if tokens[i + 2] && !tokens[i + 2].match(/\d{2}[:,.]\d{2}/)
       2.   [..., time, st,  st,  time, ...] 
       3. X [..., time, st,  st]  undef    - if tokens[i] && !tokens[i+2] 
       
          If a pair of st tokens following a sequence of time tokens:

          1. is followed by a st token - the pair belongs to the current group
          2. is followed by a time token - the pair belongs to the next group
          3. is the last 2 elements in the tokens array - the pair belongs to the current group           
        */
        if (
          (tokens[i] && !tokens[i + 2]) ||
          (tokens[i + 2] && !tokens[i + 2].match(/\d{2}[:,.]\d{2}/))
        ) {
          aTokenGroup.push(tokens[i], tokens[i + 1])
        }
        tokenGroups.push(aTokenGroup)
        aTokenGroup = []
      }
      return tokenGroups
    }

    function filterTokensAndCreateServiceUpdateObjectsArray(
      tokens: string[],
      updateId: number,
      updateLink: string
    ) {
      const excluded = /(Resnik|Mladenov|Lazarev)/i
      const tokenGroups = groupTokens(tokens)
      const serviceUpdateObjects: TrainServiceUpdateObject[] = []
      if (!tokenGroups.length) return serviceUpdateObjects
      for (let j = 0; j < tokenGroups.length; j++) {
        if (!tokenGroups[j].length) continue
        for (let i = 0; i < tokenGroups[j].length - 1; i++) {
          if (
            tokenGroups[j][i].match(excluded) ||
            tokenGroups[j][i + 1].match(excluded)
          ) {
            continue
          } else {
            let timeTokens = null
            let missingRouteSegment = null
            // Check if the token group contains missing route segment tokens:
            if (
              tokenGroups[j][tokenGroups[j].length - 1].match(
                new RegExp(`\\b(${stationNamesCaseVariations.join('|')})\\b`)
              ) &&
              tokenGroups[j][tokenGroups[j].length - 2].match(
                new RegExp(`\\b(${stationNamesCaseVariations.join('|')})\\b`)
              )
            ) {
              timeTokens = tokenGroups[j].slice(
                i + 2,
                tokenGroups[j].length - 2
              )
              missingRouteSegment = `${tokenGroups[j][tokenGroups[j].length - 2]} - ${tokenGroups[j][tokenGroups[j].length - 1]}`
            } else {
              timeTokens = tokenGroups[j].slice(i + 2)
            }
            // Create a service update object for every time token in the group:
            for (let y = 0; y < timeTokens.length; y++) {
              const aServiceUpdateObject = {
                id: updateId + Math.random(),
                tokens: {
                  from: tokenGroups[j][i],
                  to: tokenGroups[j][i + 1],
                  time: timeTokens[y] as TimeOutput,
                  omitsARouteSegment: missingRouteSegment,
                },
                link: updateLink,
              }
              serviceUpdateObjects.push(aServiceUpdateObject)
            }
          }
        }
      }
      return serviceUpdateObjects
    }

    setUpdates(serviceUpdateObjects)
    setLoadingUpdates(false)
  }

  useEffect(() => {
    trainServiceUpdates()
  }, [])

  return { updates, loadingUpdates }
}

export default useTrainServiceUpdates
