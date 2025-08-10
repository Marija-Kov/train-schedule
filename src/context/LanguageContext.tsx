import { createContext, ReactNode, useState } from 'react';

type Language = "SR" | "EN";

const LanguageContext = createContext<{
    languageFlag: Language,
    formLanguage: { from: string, from_title: string, to: string, to_title: string, date: string, time: string, searchBtnText: string }, // TODO: no any
    infoLanguage: {
        intro: string,
        schedule_link: string,
        valid_until: string,
        personal_use: string,
        note_title: string,
        schedule_change_note: string,
        schedule_change_announcements_link: string,
        for_info: string,
    },
    changeLanguage: (language: Language) => void
}>({
    languageFlag: "SR",
    formLanguage: {
        from: "Od",
        from_title: "Početna stanica",
        to: "Do",
        to_title: "Završna stanica",
        date: "Datum",
        time: "Vreme",
        searchBtnText: "Pretraga"
    },
    infoLanguage: {
        intro: "Ova aplikacija predstavlja pristupačniju verziju",
        schedule_link: "reda vožnje za BG voz",
        valid_until: "na potezu Batajnica-Ovča (u oba smera) koji važi do 13. decembra 2025.",
        personal_use: "Aplikacija je izrađena za lične potrebe fizičkog lica. Autorka aplikacije nema veze sa SrbijaVozom niti je SrbijaVoz naručilac usluge izrade aplikacije.",
        note_title: "NAPOMENA:",
        schedule_change_note: "Saobraćaj vozova je podložan vanrednim izmenama. Pogledajte",
        schedule_change_announcements_link: "ovu stranicu",
        for_info: "za informacije.",
    },
    changeLanguage: (_) => { }
});

const LanguageContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // fetch JSON with translations
    const translation = JSON.stringify({
        form: {
            sr: {
                from: "Od",
                from_title: "Početna stanica",
                to: "Do",
                to_title: "Završna stanica",
                date: "Datum",
                time: "Vreme",
                searchBtnText: "Pretraga"
            },
            en: {
                from: "From",
                from_title: "Departure station",
                to: "To",
                to_title: "Arrival station",
                date: "Date",
                time: "Time",
                searchBtnText: "Search"
            },
        },
        info: {
            sr: {
                intro: "Ova aplikacija predstavlja pristupačniju verziju",
                schedule_link: "reda vožnje za BG voz",
                valid_until: "na potezu Batajnica-Ovča (u oba smera) koji važi do 13. decembra 2025.",
                personal_use: "Aplikacija je izrađena za lične potrebe fizičkog lica. Autorka aplikacije nema veze sa SrbijaVozom niti je SrbijaVoz naručilac usluge izrade aplikacije.",
                note_title: "NAPOMENA:",
                schedule_change_note: "Saobraćaj vozova je podložan vanrednim izmenama. Pogledajte",
                schedule_change_announcements_link: "ovu stranicu",
                for_info: "za informacije.",
                // TODO: aria-label?
            },
            en: {
                intro: "This app is a more usable version of",
                schedule_link: "the Belgrade train schedule",
                valid_until: "on the relation Batajnica-Ovča (in both directions) valid until December 13th 2025.",
                personal_use: "The application is built and maintained for personal use. The developer of this application is not affilliated with SrbijaVoz.",
                note_title: "NOTE:",
                schedule_change_note: "Occasionally, some departures may be off schedule or cancelled. See",
                schedule_change_announcements_link: "this page",
                for_info: "for more information.",
            },
        }
    });

    const [languageFlag, setLanguageFlag] = useState<Language>("SR");
    const [formLanguage, setFormLanguage] = useState(JSON.parse(translation).form.sr);
    const [infoLanguage, setInfoLanguage] = useState(JSON.parse(translation).info.sr);

    function changeLanguage(l: Language) {
        setLanguageFlag(l);
        const formTranslation = JSON.parse(translation).form[l.toLowerCase()];
        const infoTranslation = JSON.parse(translation).info[l.toLowerCase()];
        setFormLanguage(formTranslation);
        setInfoLanguage(infoTranslation);
    }

    return (
        <LanguageContext.Provider value={{ languageFlag, changeLanguage, formLanguage, infoLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export { LanguageContext, LanguageContextProvider }