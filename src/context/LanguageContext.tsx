import { createContext, ReactNode, useState } from 'react';

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
            search_btn_text: "Pretraga"
        },
        en: {
            from: "From",
            from_title: "Departure station",
            to: "To",
            to_title: "Arrival station",
            date: "Date",
            time: "Time",
            search_btn_text: "Search"
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
            schedule_change_announcements_link: "zvaničnu stranicu SrbijaVoza",
            for_info: "za informacije.",
        },
        en: {
            intro: "This app is a more usable version of",
            schedule_link: "the Belgrade train schedule",
            valid_until: "on the relation Batajnica-Ovča (in both directions) valid until December 13th 2025.",
            personal_use: "The application is built and maintained for personal use. The developer of this application is not affilliated with SrbijaVoz.",
            note_title: "NOTE:",
            schedule_change_note: "Occasionally, some departures may be off schedule or cancelled. See",
            schedule_change_announcements_link: "the official Serbian railways info page",
            for_info: "for more information.",
        },
    },
    app_layout: {
        sr: {
            app_info_label: "Informacije o aplikaciji"
        },
        en: {
            app_info_label: "About this app"
        },

    },
    departures_layout: {
        sr: {
            departure_time_title: "polazak",
            arrival_time_title: "dolazak",
            train_number_title: "br. voza",
            loading_message: "Učitavanje",
            on_schedule: "Nema odstupanja od reda vožnje.",
            service_updates_not_available: "Informacije o eventualnim izmenama u saobraćaju vozova trenutno su nedostupne.",
            back_btn_text: "nazad"
        },
        en: {
            departure_time_title: "departure",
            arrival_time_title: "arrival",
            train_number_title: "train no.",
            loading_message: "Loading",
            on_schedule: "All departures on schedule.",
            service_updates_not_available: "Train service updates not available at the moment.",
            back_btn_text: "back"
        },
    },
    no_departures: {
        sr: {
            no_departures_message: "Nema polazaka po tim parametrima",
        },
        en: {
            no_departures_message: "No departures found",
        },
    },
});

type Language = "SR" | "EN";

type FormContent = {
    from: string,
    from_title: string,
    to: string,
    to_title: string,
    date: string,
    time: string,
    search_btn_text: string
}

type InfoPageContent = {
    intro: string,
    schedule_link: string,
    valid_until: string,
    personal_use: string,
    note_title: string,
    schedule_change_note: string,
    schedule_change_announcements_link: string,
    for_info: string,
}

type DeparturesLayoutContent = {
    departure_time_title: string,
    arrival_time_title: string,
    train_number_title: string,
    loading_message: string,
    on_schedule: string,
    service_updates_not_available: string,
    back_btn_text: string
}

const LanguageContext = createContext<{
    formLanguage: FormContent,
    infoLanguage: InfoPageContent,
    appLayoutLanguage: { app_info_label: string },
    departuresLayoutLanguage: DeparturesLayoutContent,
    noDeparturesLanguage: { no_departures_message: string },
    changeLanguage: (language: Language) => void
}>({
    formLanguage: JSON.parse(translation).form.sr,
    infoLanguage: JSON.parse(translation).info.sr,
    appLayoutLanguage: JSON.parse(translation).app_layout.sr,
    departuresLayoutLanguage: JSON.parse(translation).departures_layout.sr,
    noDeparturesLanguage: JSON.parse(translation).no_departures.sr,
    changeLanguage: (_) => { }
});

const LanguageContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [formLanguage, setFormLanguage] = useState(JSON.parse(translation).form.sr);
    const [infoLanguage, setInfoLanguage] = useState(JSON.parse(translation).info.sr);
    const [departuresLayoutLanguage, setDeparturesLayoutLanguage] = useState(JSON.parse(translation).departures_layout.sr);
    const [appLayoutLanguage, setAppLayoutLanguage] = useState(JSON.parse(translation).app_layout.sr);
    const [noDeparturesLanguage, setNoDeparturesLanguage] = useState(JSON.parse(translation).no_departures.sr);

    function changeLanguage(l: Language) {
        const formTranslation = JSON.parse(translation).form[l.toLowerCase()];
        const infoTranslation = JSON.parse(translation).info[l.toLowerCase()];
        const departuresLayoutTranslation = JSON.parse(translation).departures_layout[l.toLowerCase()];
        const appLayoutTranslation = JSON.parse(translation).app_layout[l.toLowerCase()];
        const noDeparturesTranslation = JSON.parse(translation).no_departures[l.toLowerCase()];
        setFormLanguage(formTranslation);
        setInfoLanguage(infoTranslation);
        setDeparturesLayoutLanguage(departuresLayoutTranslation);
        setAppLayoutLanguage(appLayoutTranslation);
        setNoDeparturesLanguage(noDeparturesTranslation);
    }

    return (
        <LanguageContext.Provider value={{ changeLanguage, formLanguage, infoLanguage, departuresLayoutLanguage, appLayoutLanguage, noDeparturesLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export { LanguageContext, LanguageContextProvider }