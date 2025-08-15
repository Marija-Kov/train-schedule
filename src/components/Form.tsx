import { useContext, useEffect, useState } from "react";
import { FormInputData, StationName, TimeOutput, YyyyMmDd } from "train-schedule-types";
import { useNavigate } from "react-router";
import { LanguageContext } from "../context/LanguageContext";
import useBrowserStorage from "../hooks/useBrowserStorage/useBrowserStorage";

const Form = () => {
  const navigate = useNavigate();
  const { browserStorage, session } = useBrowserStorage();
  const { formLanguage } = useContext(LanguageContext);

  const [input, setInput] = useState<FormInputData>({
    from: undefined,
    to: undefined,
    date: (new Date()).toISOString().split('T')[0] as YyyyMmDd,
    time: (new Date()).toTimeString().split(' ')[0].substring(0, 5) as TimeOutput
  })

  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  useEffect(() => {
    const lastQueryJSON = browserStorage(session, "lastQuery");
    if (lastQueryJSON) {
      const lastQuery = JSON.parse(lastQueryJSON);
      document.querySelectorAll("select")[1].value = lastQuery.from as StationName || "";
      document.querySelectorAll("select")[2].value = lastQuery.to as StationName || "";
      document.querySelectorAll("input")[0].value = lastQuery.date as YyyyMmDd
      document.querySelectorAll("input")[1].value = lastQuery.time as TimeOutput
      setInput({
        from: lastQuery.from as StationName,
        to: lastQuery.to as StationName,
        date: lastQuery.date as YyyyMmDd,
        time: lastQuery.time as TimeOutput
      })
    }
  }, [])

  const handleChange = (e: React.FormEvent) => {
    const { name } = e.target as HTMLSelectElement;
    const { value } = e.target as HTMLSelectElement;
    return setInput(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.from) setEmptyFields(prev => ["from", ...prev]);
    if (!input.to) setEmptyFields(prev => ["to", ...prev]);
    if (!input.date) setEmptyFields(prev => ["date", ...prev]);
    if (!input.time) setEmptyFields(prev => ["time", ...prev]);

    if (input.from && input.to && input.date && input.time) {
      browserStorage(session, "lastQuery", JSON.stringify(input));
      navigate(`/departures/${input.from}/${input.to}/${input.date}/${input.time}`);
      setEmptyFields([]);
    }
  }

  return (
    <form data-testid="search-form" onSubmit={handleSubmit}>
      <label htmlFor="from">{formLanguage.from}:</label>
      <select
        onChange={handleChange}
        data-testid="select-departure-station"
        name="from"
        className={emptyFields.includes("from") ? "error" : ""}
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
      </select>
      <label htmlFor="to">{formLanguage.to}:</label>
      <select
        onChange={handleChange}
        data-testid="select-arrival-station"
        name="to"
        className={emptyFields.includes("to") ? "error" : ""}
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
      </select>
      <label htmlFor="date">{formLanguage.date}:</label>
      <input
        onChange={handleChange}
        data-testid="select-departure-date"
        name="date"
        type="date"
        value={input.date}
        min="2024-12-15"
        max="2025-12-13"
        className={emptyFields.includes("date") ? "error" : ""}
      ></input>
      <label htmlFor="time">{formLanguage.time}:</label>
      <input
        onChange={handleChange}
        data-testid="select-departure-time"
        name="time"
        type="time"
        value={input.time}
        className={emptyFields.includes("time") ? "error" : ""}
      ></input>
      <button
        data-testid="search-departures-btn"
        className="search"
      >
        {formLanguage.search_btn_text}
      </button>
    </form>
  )
}

export default Form