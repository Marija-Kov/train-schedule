import { useContext, useEffect, useState } from 'react'
import { LanguageContext } from '../../context'
import { useTrainServiceUpdates } from '../../hooks'
import { TimeOutput } from 'train-schedule-types'

type TrainServiceUpdateTokens = {
  from: string
  to: string
  time: TimeOutput
  omitsARouteSegment?: null | string
}

type TrainServiceUpdateObject = {
  id: string
  tokens: TrainServiceUpdateTokens
  link: string
}

const TrainServiceUpdates = () => {
  const { trainServiceUpdates } = useTrainServiceUpdates()
  const [updates, setUpdates] = useState<
    TrainServiceUpdateObject[] | 'Data not available'
  >([])
  const [loadingUpdates, setLoadingUpdates] = useState(false)
  const { trainServiceUpdatesLanguage } = useContext(LanguageContext)

  useEffect(() => {
    setLoadingUpdates(true)
    async function load() {
      try {
        const updates = await trainServiceUpdates()
        setUpdates(updates)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingUpdates(false)
      }
    }
    load()
  }, [])

  return (
    <>
      {loadingUpdates ? (
        <p>{trainServiceUpdatesLanguage.loading_message}...</p>
      ) : typeof updates === 'string' && updates === 'Data not available' ? (
        <p className="service-updates-not-available">
          {trainServiceUpdatesLanguage.service_updates_not_available}
        </p>
      ) : updates.length ? (
        <div className="service-updates--container">
          <h4 className="service-updates--title">
            {trainServiceUpdatesLanguage.service_updates_today},{' '}
            {trainServiceUpdatesLanguage.date_today} (
            {trainServiceUpdatesLanguage.except_otherwise_specified}):
          </h4>
          {updates.map((u) => {
            return (
              <p className="service-update-details" key={u.id}>
                {trainServiceUpdatesLanguage.departure_from} {u.tokens.from}{' '}
                {trainServiceUpdatesLanguage.to} {u.tokens.to}{' '}
                {trainServiceUpdatesLanguage.at_time} {u.tokens.time}h{' '}
                {trainServiceUpdatesLanguage.has_been_cancelled}
                {u.tokens.omitsARouteSegment && (
                  <>
                    {' '}
                    {trainServiceUpdatesLanguage.missing_section}{' '}
                    {u.tokens.omitsARouteSegment}
                  </>
                )}
                .
                <a
                  href={u.link}
                  className="service-update-external-link"
                  aria-label={
                    trainServiceUpdatesLanguage.external_link_to_service_update
                  }
                  data-testid="service-update-external-link"
                >
                  [{trainServiceUpdatesLanguage.info_source}]
                </a>
              </p>
            )
          })}
        </div>
      ) : (
        <p>{trainServiceUpdatesLanguage.on_schedule}</p>
      )}

      <div className="service-updates-note">
        <div className="warning-sign">⚠</div>
        <p>
          {trainServiceUpdatesLanguage.service_updates_note}{' '}
          <a href="https://srbijavoz.rs/informacije/">
            {trainServiceUpdatesLanguage.please_check}
          </a>
          .
        </p>
      </div>
    </>
  )
}

export default TrainServiceUpdates
