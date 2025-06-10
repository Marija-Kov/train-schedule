const Info = () => {
  return (
    <div className="info--content">
      <p>
        Ova aplikacija predstavlja pristupačniju verziju
        <a href="https://www.srbvoz.rs/wp-content/redvoznje/rv_bg_voza_za_2022.pdf"> reda vožnje za BG voz </a>
        na potezu Batajnica-Ovča (u oba smera) koji važi do 13. decembra 2025.
        <br></br>
        <br></br>
        Aplikacija je izrađena za lične potrebe fizičkog lica. Autorka
        aplikacije nema veze sa SrbijaVozom niti je SrbijaVoz naručilac usluge
        izrade aplikacije.
      <br></br>
      <br></br>
       NAPOMENA: 
       <br></br>
       Saobraćaj vozova je podložan vanrednim izmenama. 
       Pogledajte 
        <a aria-label="schedule change announcements" href="https://srbijavoz.rs/informacije/"><strong> ovu stranicu </strong></a>
        za informacije.
      </p>

      <a aria-label="repo" href="https://github.com/Marija-Kov/train-schedule">
        <img className="github-icon" src="/github.png" />
      </a>
    </div>
  );
};

export default Info;