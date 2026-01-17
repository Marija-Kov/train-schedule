import { createContext, ReactNode, useState } from 'react'

// fetch JSON with translations
const translation = JSON.stringify({
  form: {
    sr: {
      from: 'Od',
      from_title: 'Početna stanica',
      to: 'Do',
      to_title: 'Završna stanica',
      date: 'Datum',
      time: 'Vreme',
      search_btn_text: 'Pretraga',
    },
    en: {
      from: 'From',
      from_title: 'Departure station',
      to: 'To',
      to_title: 'Arrival station',
      date: 'Date',
      time: 'Time',
      search_btn_text: 'Search',
    },
  },
  info: {
    sr: {
      intro:
        'Cilj ove aplikacije je da omogući jednostavniji i brži pristup podacima iz',
      schedule_link: 'reda vožnje za BG voz',
      valid_until:
        'na potezu Batajnica-Ovča (u oba smera) koji važi do 12. decembra 2026.',
      personal_use:
        'Aplikacija je izrađena i održava se za lične potrebe fizičkog lica. Autor aplikacije nema veze sa SrbijaVozom niti je SrbijaVoz naručilac usluge izrade aplikacije. Podaci o redu vožnje prikazani u aplikaciji mogu sadržati greške i ne postoji garancija za njihovu tačnost.',
      note_title: 'NAPOMENA:',
      schedule_change_note:
        'Saobraćaj vozova je podložan vanrednim izmenama. Pogledajte',
      schedule_change_announcements_link: 'zvaničnu stranicu SrbijaVoza',
      for_info: 'za informacije.',
    },
    en: {
      intro: 'This app aims to enable a simple and efficient access to',
      schedule_link: 'Belgrade train schedule',
      valid_until:
        'for relation Batajnica-Ovča (in both directions) valid until December 12th 2026.',
      personal_use:
        'The app is built and maintained for personal use. The developer is not affiliated with SrbijaVoz. Schedule-related data shown in the app may contain errors and there is no guarantee for its correctness.',
      note_title: 'NOTE:',
      schedule_change_note:
        'Occasionally, some departures may be off schedule or cancelled. See',
      schedule_change_announcements_link:
        'the official Serbian railway info page',
      for_info: 'for more information.',
    },
  },
  app_layout: {
    sr: {
      app_info_label: 'Informacije o aplikaciji',
    },
    en: {
      app_info_label: 'About this app',
    },
  },
  departures_layout: {
    sr: {
      departure_time_title: 'polazak',
      arrival_time_title: 'dolazak',
      train_number_title: 'br. voza',
      loading_message: 'Učitavanje',
      service_updates_today: 'Izmene važe danas',
      date_today: new Intl.DateTimeFormat('en-GB').format(new Date()),
      except_otherwise_specified: 'osim ako je drugačije naglašeno',
      external_link_to_service_update:
        'objava o izmeni na zvaničnom sajtu SrbijaVoza',
      on_schedule: 'Nema odstupanja od reda vožnje.',
      service_updates_not_available:
        'Informacije o eventualnim izmenama u saobraćaju vozova trenutno su nedostupne.',
      service_updates_note:
        'Prikazane informacije o izmenama u saobraćaju mogu biti nepotpune.',
      please_check: 'Molimo proverite na zvaničnoj stranici SrbijaVoza',
      departure_from: 'Polazak sa stanice',
      to: 'do stanice',
      at_time: 'u',
      has_been_cancelled: 'nece saobracati iz tehnickih razloga',
      info_source: 'izvor',
      back_btn_text: 'nazad',
    },
    en: {
      departure_time_title: 'departure',
      arrival_time_title: 'arrival',
      train_number_title: 'train no.',
      loading_message: 'Loading',
      service_updates_today: 'Service updates for today',
      date_today: new Intl.DateTimeFormat('en-GB').format(new Date()),
      except_otherwise_specified: 'unless otherwise specified',
      external_link_to_service_update:
        'read the update on the official Serbian railway page',
      on_schedule: 'All departures on schedule.',
      service_updates_not_available:
        'Train service updates not available at the moment.',
      service_updates_note: 'Service updates shown here may not be thorough.',
      please_check: 'Please refer to the official Serbian railway page',
      departure_from: 'Departure from',
      to: 'to',
      at_time: 'at',
      has_been_cancelled: 'has been cancelled for technical reasons',
      info_source: 'source',
      back_btn_text: 'back',
    },
  },
  train_service_updates: {
    sr: {
      loading_message: 'Učitavanje izmena u saobraćaju',
      service_updates_today: 'Izmene važe danas',
      date_today: new Intl.DateTimeFormat('en-GB').format(new Date()),
      except_otherwise_specified: 'osim ako je drugačije naglašeno',
      external_link_to_service_update:
        'objava o izmeni na zvaničnom sajtu SrbijaVoza',
      on_schedule: 'Nema odstupanja od reda vožnje.',
      service_updates_not_available:
        'Informacije o eventualnim izmenama u saobraćaju vozova trenutno su nedostupne.',
      service_updates_note:
        'Prikazane informacije o izmenama u saobraćaju mogu biti nepotpune.',
      please_check: 'Molimo proverite na zvaničnoj stranici SrbijaVoza',
      departure_from: 'Polazak sa stanice',
      to: 'do stanice',
      at_time: 'u',
      has_been_cancelled: 'nece saobracati iz tehnickih razloga',
      info_source: 'izvor',
    },
    en: {
      loading_message: 'Checking for service updates',
      service_updates_today: 'Service updates for today',
      date_today: new Intl.DateTimeFormat('en-GB').format(new Date()),
      except_otherwise_specified: 'unless otherwise specified',
      external_link_to_service_update:
        'read the update on the official Serbian railway page',
      on_schedule: 'All departures on schedule.',
      service_updates_not_available:
        'Train service updates not available at the moment.',
      service_updates_note: 'Service updates shown here may not be thorough.',
      please_check: 'Please refer to the official Serbian railway page',
      departure_from: 'Departure from',
      to: 'to',
      at_time: 'at',
      has_been_cancelled: 'has been cancelled for technical reasons',
      info_source: 'source',
    },
  },
  no_departures: {
    sr: {
      no_departures_message: 'Nema polazaka po tim parametrima',
    },
    en: {
      no_departures_message: 'No departures found',
    },
  },
})

type Language = 'SR' | 'EN'

type FormContent = {
  from: string
  from_title: string
  to: string
  to_title: string
  date: string
  time: string
  search_btn_text: string
}

type InfoPageContent = {
  intro: string
  schedule_link: string
  valid_until: string
  personal_use: string
  note_title: string
  schedule_change_note: string
  schedule_change_announcements_link: string
  for_info: string
}

type DeparturesLayoutContent = {
  departure_time_title: string
  arrival_time_title: string
  train_number_title: string
  loading_message: string
  service_updates_today: string
  date_today: string
  except_otherwise_specified: string
  external_link_to_service_update: string
  on_schedule: string
  service_updates_not_available: string
  service_updates_note: string
  please_check: string
  departure_from: string
  to: string
  at_time: string
  has_been_cancelled: string
  info_source: string
  back_btn_text: string
}

type TrainServiceUpdatesContent = {
  loading_message: string
  service_updates_today: string
  date_today: string
  except_otherwise_specified: string
  external_link_to_service_update: string
  on_schedule: string
  service_updates_not_available: string
  service_updates_note: string
  please_check: string
  departure_from: string
  to: string
  at_time: string
  has_been_cancelled: string
  info_source: string
}

const LanguageContext = createContext<{
  formLanguage: FormContent
  infoLanguage: InfoPageContent
  appLayoutLanguage: { app_info_label: string }
  departuresLayoutLanguage: DeparturesLayoutContent
  trainServiceUpdatesLanguage: TrainServiceUpdatesContent
  noDeparturesLanguage: { no_departures_message: string }
  changeLanguage: (language: Language) => void
}>({
  formLanguage: JSON.parse(translation).form.sr,
  infoLanguage: JSON.parse(translation).info.sr,
  appLayoutLanguage: JSON.parse(translation).app_layout.sr,
  departuresLayoutLanguage: JSON.parse(translation).departures_layout.sr,
  trainServiceUpdatesLanguage: JSON.parse(translation).train_service_updates.sr,
  noDeparturesLanguage: JSON.parse(translation).no_departures.sr,
  changeLanguage: (_) => _,
})

const LanguageContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formLanguage, setFormLanguage] = useState(
    JSON.parse(translation).form.sr
  )
  const [infoLanguage, setInfoLanguage] = useState(
    JSON.parse(translation).info.sr
  )
  const [departuresLayoutLanguage, setDeparturesLayoutLanguage] = useState(
    JSON.parse(translation).departures_layout.sr
  )
  const [trainServiceUpdatesLanguage, setTrainServiceUpdatesLanguage] =
    useState(JSON.parse(translation).train_service_updates.sr)
  const [appLayoutLanguage, setAppLayoutLanguage] = useState(
    JSON.parse(translation).app_layout.sr
  )
  const [noDeparturesLanguage, setNoDeparturesLanguage] = useState(
    JSON.parse(translation).no_departures.sr
  )

  function changeLanguage(l: Language) {
    const formTranslation = JSON.parse(translation).form[l.toLowerCase()]
    const infoTranslation = JSON.parse(translation).info[l.toLowerCase()]
    const departuresLayoutTranslation =
      JSON.parse(translation).departures_layout[l.toLowerCase()]
    const trainServiceUpdatesTranslation =
      JSON.parse(translation).train_service_updates[l.toLowerCase()]
    const appLayoutTranslation =
      JSON.parse(translation).app_layout[l.toLowerCase()]
    const noDeparturesTranslation =
      JSON.parse(translation).no_departures[l.toLowerCase()]
    setFormLanguage(formTranslation)
    setInfoLanguage(infoTranslation)
    setDeparturesLayoutLanguage(departuresLayoutTranslation)
    setTrainServiceUpdatesLanguage(trainServiceUpdatesTranslation)
    setAppLayoutLanguage(appLayoutTranslation)
    setNoDeparturesLanguage(noDeparturesTranslation)
  }

  return (
    <LanguageContext.Provider
      value={{
        changeLanguage,
        formLanguage,
        infoLanguage,
        departuresLayoutLanguage,
        trainServiceUpdatesLanguage,
        appLayoutLanguage,
        noDeparturesLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export { LanguageContext, LanguageContextProvider }
