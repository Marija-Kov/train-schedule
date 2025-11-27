import { useEffect, useState } from 'react'

const useTrainServiceUpdates = () => {
  const [updates, setUpdates] = useState<
    {
      id: number
      link: string
      segments: { from: string; to: string; time: string; missing?: string }
    }[]
  >([])
  const [loadingUpdates, setLoadingUpdates] = useState(false)

  const trainServiceUpdates = async () => {
    setLoadingUpdates(true)
    const currentDateTime = new Date().toISOString().split('.')[0]
    const currentDate = currentDateTime.split('T')[0]

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

    const filteredUpdates: {
      id: number
      link: string
      segments: { from: string; to: string; time: string; missing?: string }
    }[] = data
      .filter(
        (update: {
          date: string
          slug: string
          content: { rendered: string }
        }) => {
          const updateDate = update.date.split('T')[0]
          return (
            updateDate === currentDate &&
            update.slug.match(/bgvoz/i) &&
            !update.content.rendered.match(/(Resnik|Mladenov|Lazarev)/i)
          )
        }
      )
      .map(
        (update: {
          id: number
          link: string
          content: { rendered: string }
        }) => {
          const segments = extractSegments(
            update.content.rendered.split('\n')[1].slice(3, -4)
          )
          return {
            id: update.id,
            content: update.content.rendered.split('\n')[1].slice(3, -4),
            segments,
            link: update.link,
          }
        }
      )
    function extractSegments(string: string) {
      const from = string.split(' za ')[0].split(' polazi iz ')[1]
      const to = string.split(' u ')[0].split(' za ')[1]
      const time = string.split(' časova')[0].split(' u ')[1]
      const missing =
        string.includes('izostaje na delu relacije') &&
        string.split('izostaje na delu relacije')[1].split('.')[0]

      return {
        from,
        to,
        time,
        missing,
      }
    }

    setUpdates(filteredUpdates)
    setLoadingUpdates(false)
  }

  useEffect(() => {
    trainServiceUpdates()
  }, [])

  return { updates, loadingUpdates }
}

export default useTrainServiceUpdates
