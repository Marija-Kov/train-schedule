import { useRef, useState } from "react";


const Form = ({ showRes }) => {
  const from = useRef();
  const to = useRef();
  const date = useRef();
  const time = useRef();

  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = (e) => {
   e.preventDefault();
   const input = {
    from: from.current.value,
    to: to.current.value,
    date: date.current.value,
    time: time.current.value,
   }
   if(!input.from) setEmptyFields(prev => ["from", ...prev]);
   if(!input.to) setEmptyFields(prev => ["to", ...prev]);
   if(!input.date) setEmptyFields(prev => ["date", ...prev]);
   if(!input.time) setEmptyFields(prev => ["time", ...prev]);
   
   if(input.from && input.to && input.date && input.time){
    setEmptyFields([]);
    showRes();
   }
   console.log("handleSubmit")

  }

  return (
    <form onSubmit={handleSubmit}>
        <label htmlFor="from">Od/From:</label>
        <select 
         ref={from} 
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
         ref={to} 
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
         ref={date} 
         name="date" 
         type="date" 
         max="2023-12-12"
         className={emptyFields.includes("date") ? "error" : ""}
         ></input>
        <label htmlFor="time">Vreme/Time:</label>
        <input 
         ref={time} 
         name="time" 
         type="time"
         className={emptyFields.includes("time") ? "error" : ""}
         ></input>
        <button 
         className="search"
         >
          Pretraga
        </button>
      </form>   
  )
}

export default Form
