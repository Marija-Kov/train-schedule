import { useRef, useState } from "react";
import useFetchTrainsAPI from "../hooks/useFetchTrainsAPI";
import { StationName } from "../typeDefinitions/boringTypes";
import { FormProps, Input, YyyyMmDd, Time } from "../typeDefinitions/types";

const Form = (props: FormProps) => {
  const { fetchTrainsAPI } = useFetchTrainsAPI();
  const from = useRef<HTMLSelectElement>();
  const to = useRef<HTMLSelectElement>();
  const date = useRef<HTMLInputElement>();
  const time = useRef<HTMLInputElement>();

  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
   e.preventDefault();
   const input : Input = {
    from: from.current?.value as StationName,
    to: to.current?.value as StationName,
    date: date.current?.value as YyyyMmDd,
    time: time.current?.value as Time,
   }
   if(!input.from) setEmptyFields(prev => ["from", ...prev]);
   if(!input.to) setEmptyFields(prev => ["to", ...prev]);
   if(!input.date) setEmptyFields(prev => ["date", ...prev]);
   if(!input.time) setEmptyFields(prev => ["time", ...prev]);
   
   if(input.from && input.to && input.date && input.time){
    setEmptyFields([]);
    const departures = await fetchTrainsAPI(input);
    props.runSetDepartures(departures);
   }

  }

  return (
    <form aria-label="form" onSubmit={handleSubmit}>
        <label htmlFor="from">Od/From:</label>
        <select 
         ref={from as React.MutableRefObject<HTMLSelectElement>}
         aria-label="select departure station" 
         name="from"
         className={emptyFields.includes("from") ? "error" : ""}
         >
         <option value="">Početna stanica</option>
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
        <label htmlFor="to">Do/To:</label>
        <select 
         ref={to as React.MutableRefObject<HTMLSelectElement>} 
         aria-label="select arrival station"
         name="to"
         className={emptyFields.includes("to") ? "error" : ""}
         >
         <option value="">Završna stanica</option>
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
        <label htmlFor="date">Datum/Date:</label>
        <input 
         ref={date as React.MutableRefObject<HTMLInputElement>} 
         aria-label="select date of departure"
         name="date" 
         type="date" 
         min="2024-12-15"
         max="2025-12-13"
         className={emptyFields.includes("date") ? "error" : ""}
         ></input>
        <label htmlFor="time">Vreme/Time:</label>
        <input 
         ref={time as React.MutableRefObject<HTMLInputElement>}
         aria-label="select time of departure" 
         name="time" 
         type="time"
         className={emptyFields.includes("time") ? "error" : ""}
         ></input>
        <button 
         aria-label="search departures"
         className="search"
         >
          Pretraga
        </button>
      </form>   
  )
}

export default Form
