import { InfoProps } from "../types";

const Info = (props: InfoProps) => {
  const { runSetAppInfo } = props;
  return (
    <div className="info--content">
     <p>
        Ova aplikacija predstavlja pristupačniju verziju
        <br></br>
        <a href="https://www.srbvoz.rs/wp-content/redvoznje/rv_bg_voza_za_2022.pdf">
            reda vožnje za BG voz 
        </a>
        <br></br>
        na potezu Batajnica-Ovča (u oba smera) koji važi do 9. decembra 2023.
     </p>
     <p>
       Autorka aplikacije nema veze sa JKP-om niti je JKP naručilac usluge izrade aplikacije. 
     </p>     

    <a
     aria-label="repo" 
     href="https://github.com/Marija-Kov/train-schedule">
      <img 
      className="github-icon"
      src="/github.png"/>
    </a>

    <button 
     aria-label="close app info"
     className="back"
     onClick={runSetAppInfo}
     >
      nazad
    </button>

   </div>
  )
}

export default Info;
