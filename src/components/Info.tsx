import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

const Info = () => {
  const { infoLanguage } = useContext(LanguageContext);
  return (
    <div className="info--content">
      <div>
        {infoLanguage.intro}
        <a data-testid="schedule-pdf-link" href="https://www.srbvoz.rs/wp-content/redvoznje/rv_bg_voza_za_2022.pdf"> {infoLanguage.schedule_link} </a>
        {infoLanguage.valid_until}
        <br></br>
        <br></br>
        {infoLanguage.personal_use}
        <br></br>
        <br></br>
        <h4 data-testid="note-on-schedule-changes-title">{infoLanguage.note_title}</h4>
        {infoLanguage.schedule_change_note}
        <a data-testid="schedule-change-announcements" href="https://srbijavoz.rs/informacije/"><strong> {infoLanguage.schedule_change_announcements_link} </strong></a>
        {infoLanguage.for_info}
      </div>

      <a data-testid="repo-link" href="https://github.com/Marija-Kov/train-schedule">
        <img className="github-icon" src="/github.png" alt="Github logo."/>
      </a>
    </div>
  );
};

export default Info;