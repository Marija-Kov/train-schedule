import { useContext, useEffect, useState } from 'react'
import {
  FormInputData,
  StationName,
  TimeOutput,
  YyyyMmDd,
} from 'train-schedule-types'
import { useNavigate } from 'react-router'
import { LanguageContext } from '../../context'
import { useBrowserStorage } from '../../hooks'

const Form = () => {
  const navigate = useNavigate()
  const { browserStorage, session } = useBrowserStorage()
  const { formLanguage } = useContext(LanguageContext)

  const [input, setInput] = useState<FormInputData>({
    from: undefined,
    to: undefined,
    date: new Date().toISOString().split('T')[0] as YyyyMmDd,
    time: new Date().toTimeString().split(' ')[0].substring(0, 5) as TimeOutput,
  })

  const [emptyFields, setEmptyFields] = useState<string[]>([])

  useEffect(() => {
    const lastQueryJSON = browserStorage(session, 'lastQuery')
    if (lastQueryJSON) {
      const lastQuery = JSON.parse(lastQueryJSON)
      document.querySelectorAll('select')[1].value =
        (lastQuery.from as StationName) || ''
      document.querySelectorAll('select')[2].value =
        (lastQuery.to as StationName) || ''
      document.querySelectorAll('input')[0].value = lastQuery.date as YyyyMmDd
      document.querySelectorAll('input')[1].value = lastQuery.time as TimeOutput
      setInput({
        from: lastQuery.from as StationName,
        to: lastQuery.to as StationName,
        date: lastQuery.date as YyyyMmDd,
        time: lastQuery.time as TimeOutput,
      })
    }
  }, [])

  const handleChange = (e: React.FormEvent) => {
    const { name } = e.target as HTMLSelectElement
    const { value } = e.target as HTMLSelectElement
    setEmptyFields((prev) => prev.filter((field) => field != name))
    return setInput((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.from) setEmptyFields((prev) => ['from', ...prev])
    if (!input.to) setEmptyFields((prev) => ['to', ...prev])
    if (!input.date) setEmptyFields((prev) => ['date', ...prev])
    if (!input.time) setEmptyFields((prev) => ['time', ...prev])

    if (input.from && input.to && input.date && input.time) {
      browserStorage(session, 'lastQuery', JSON.stringify(input))
      navigate(
        `/departures/${input.from}/${input.to}/${input.date}/${input.time}`
      )
    }

    setTimeout(() => setEmptyFields([]), 3000)
  }

  const missingInputError = () => {
    return (
      <span
        className="error-missing-input"
        data-testid="missing-input-mark"
      ></span>
    )
  }

  return (
    <form data-testid="search-form" onSubmit={handleSubmit}>
      <label htmlFor="from">{formLanguage.from}:</label>
      <span>
        {emptyFields.includes('from') ? missingInputError() : ''}
        <select
          onChange={handleChange}
          id="from"
          data-testid="select-departure-station"
          name="from"
          className={emptyFields.includes('from') ? 'error' : ''}
        >
          <option value="">{formLanguage.from_title}</option>
          <option value="batajnica">Batajnica</option>
          <option value="kamendin">Kamendin</option>
          <option value="zemunsko polje">Zemunsko polje</option>
          <option value="altina">Altina</option>
          <option value="zemun">Zemun</option>
          <option value="tosin bunar">Tošin bunar</option>
          <option value="novi beograd">Novi Beograd</option>
          <option value="beograd centar">Beograd centar</option>
          <option value="karadjordjev park">Karađorđev park</option>
          <option value="vukov spomenik">Vukov spomenik</option>
          <option value="pancevacki most">Pančevački most</option>
          <option value="krnjaca most">Krnjača most</option>
          <option value="krnjaca ukr">Krnjača ukr.</option>
          <option value="sebes">Sebeš</option>
          <option value="ovca">Ovča</option>
          <option value="rakovica">Rakovica</option>
          <option value="knezevac">Kneževac</option>
          <option value="kijevo">Kijevo</option>
          <option value="resnik">Resnik</option>
          <option value="lazarevac">Lazarevac</option>
          <option value="vreoci">Vreoci</option>
          <option value="stepojevac">Stepojevac</option>
          <option value="leskovac kolubarski">Leskovac Kolubarski</option>
          <option value="veliki borak">Veliki Borak</option>
          <option value="barajevo centar">Barajevo Centar</option>
          <option value="barajevo ukr">Barajevo ukr.</option>
          <option value="bela reka">Bela reka</option>
          <option value="mladenovac">Mladenovac</option>
          <option value="ripanj">Ripanj</option>
          <option value="ripanj kolonija">Ripanj kolonija</option>
          <option value="ripanj tunel">Ripanj tunel</option>
          <option value="klenje">Klenje</option>
          <option value="ralja">Ralja</option>
          <option value="sopot kosmajski">Sopot Kosmajski</option>
          <option value="vlasko polje">Vlaško polje</option>
        </select>
      </span>
      <label htmlFor="to">{formLanguage.to}:</label>
      <span>
        {emptyFields.includes('to') ? missingInputError() : ''}
        <select
          onChange={handleChange}
          id="to"
          data-testid="select-arrival-station"
          name="to"
          className={emptyFields.includes('to') ? 'error' : ''}
        >
          <option value="">{formLanguage.to_title}</option>
          <option value="batajnica">Batajnica</option>
          <option value="kamendin">Kamendin</option>
          <option value="zemunsko polje">Zemunsko polje</option>
          <option value="altina">Altina</option>
          <option value="zemun">Zemun</option>
          <option value="tosin bunar">Tošin bunar</option>
          <option value="novi beograd">Novi Beograd</option>
          <option value="beograd centar">Beograd centar</option>
          <option value="karadjordjev park">Karađorđev park</option>
          <option value="vukov spomenik">Vukov spomenik</option>
          <option value="pancevacki most">Pančevački most</option>
          <option value="krnjaca most">Krnjača most</option>
          <option value="krnjaca ukr">Krnjača ukr.</option>
          <option value="sebes">Sebeš</option>
          <option value="ovca">Ovča</option>
          <option value="rakovica">Rakovica</option>
          <option value="knezevac">Kneževac</option>
          <option value="kijevo">Kijevo</option>
          <option value="resnik">Resnik</option>
          <option value="lazarevac">Lazarevac</option>
          <option value="vreoci">Vreoci</option>
          <option value="stepojevac">Stepojevac</option>
          <option value="leskovac kolubarski">Leskovac Kolubarski</option>
          <option value="veliki borak">Veliki Borak</option>
          <option value="barajevo centar">Barajevo Centar</option>
          <option value="barajevo ukr">Barajevo ukr.</option>
          <option value="bela reka">Bela reka</option>
          <option value="mladenovac">Mladenovac</option>
          <option value="ripanj">Ripanj</option>
          <option value="ripanj kolonija">Ripanj kolonija</option>
          <option value="ripanj tunel">Ripanj tunel</option>
          <option value="klenje">Klenje</option>
          <option value="ralja">Ralja</option>
          <option value="sopot kosmajski">Sopot Kosmajski</option>
          <option value="vlasko polje">Vlaško polje</option>
        </select>
      </span>
      <label htmlFor="date">{formLanguage.date}:</label>
      <span>
        {emptyFields.includes('date') ? missingInputError() : ''}
        <input
          onChange={handleChange}
          id="date"
          data-testid="select-departure-date"
          name="date"
          type="date"
          value={input.date}
          min="2022-12-14"
          max="2026-12-12"
          className={emptyFields.includes('date') ? 'error' : ''}
        />
      </span>
      <label htmlFor="time">{formLanguage.time}:</label>
      <span>
        {emptyFields.includes('time') ? missingInputError() : ''}
        <input
          onChange={handleChange}
          id="time"
          data-testid="select-departure-time"
          name="time"
          type="time"
          value={input.time}
          className={emptyFields.includes('time') ? 'error' : ''}
        />
      </span>
      <button data-testid="search-departures-btn" className="search">
        {formLanguage.search_btn_text}
      </button>
    </form>
  )
}

export default Form
