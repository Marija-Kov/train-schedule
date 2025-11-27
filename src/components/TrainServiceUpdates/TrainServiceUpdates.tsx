import { useContext } from 'react'
import { LanguageContext } from '../../context'
import { useTrainServiceUpdates } from '../../hooks'

const TrainServiceUpdates = () => {
  const { updates, loadingUpdates } = useTrainServiceUpdates()
  const { trainServiceUpdatesLanguage } = useContext(LanguageContext)
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
                {trainServiceUpdatesLanguage.departure_from} {u.segments.from}{' '}
                {trainServiceUpdatesLanguage.to} {u.segments.to}{' '}
                {trainServiceUpdatesLanguage.at_time} {u.segments.time}h{' '}
                {trainServiceUpdatesLanguage.has_been_cancelled}
                {u.segments.missing && (
                  <>
                    {' '}
                    {trainServiceUpdatesLanguage.missing_section}{' '}
                    {u.segments.missing}
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
