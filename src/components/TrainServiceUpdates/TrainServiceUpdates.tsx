import { useContext } from 'react'
import { LanguageContext } from '../../context'

const TrainServiceUpdates = (props: {
  updates: { id: number; content: string }[]
}) => {
  const { departuresLayoutLanguage } = useContext(LanguageContext)
  const { updates } = props
  return (
    <div className="service-updates--container">
      <h4 className="service-updates--title">
        {departuresLayoutLanguage.service_updates_today},{' '}
        {departuresLayoutLanguage.date_today} (
        {departuresLayoutLanguage.except_otherwise_specified}):
      </h4>
      {updates.map((u) => {
        return (
          <p className="service-update-details" key={u.id}>
            {u.content}
          </p>
        )
      })}
    </div>
  )
}

export default TrainServiceUpdates
