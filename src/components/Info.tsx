import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

const Info = () => {
  const { infoLanguage } = useContext(LanguageContext);
  return (
    <div className="info--content">
      <p>
        {infoLanguage.intro}
        <a href="https://www.srbvoz.rs/wp-content/redvoznje/rv_bg_voza_za_2022.pdf"> {infoLanguage.schedule_link} </a>
        {infoLanguage.valid_until}
        <br></br>
        <br></br>
        {infoLanguage.personal_use}
        <br></br>
        <br></br>
        {infoLanguage.note_title}
        <br></br>
        {infoLanguage.schedule_change_note}
        <a aria-label="schedule change announcements" href="https://srbijavoz.rs/informacije/"><strong> {infoLanguage.schedule_change_announcements_link} </strong></a>
        {infoLanguage.for_info}
      </p>

      <a aria-label="repo" href="https://github.com/Marija-Kov/train-schedule">
        <img className="github-icon" src="/github.png" />
      </a>
    </div>
  );
};

export default Info;