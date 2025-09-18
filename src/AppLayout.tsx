import { NavLink, Outlet, useNavigate, useLocation } from 'react-router'
import { DeparturesContextProvider, LanguageContext } from './context'
import { useContext, useEffect } from 'react'
import { useBrowserStorage } from './hooks'

type Language = 'SR' | 'EN'

function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { browserStorage, local } = useBrowserStorage()
  const { changeLanguage, appLayoutLanguage } = useContext(LanguageContext)

  useEffect(() => {
    const lastPickedLanguage = browserStorage(local, 'language')
    if (lastPickedLanguage) {
      changeLanguage(lastPickedLanguage as Language)
      const languageMenu = document.querySelector(
        '#language-menu'
      ) as HTMLSelectElement
      languageMenu.value = lastPickedLanguage || 'SR'
    }
  }, [])

  function handleInfoClick() {
    if (location.pathname === '/info') {
      navigate(-1)
    } else {
      navigate('/info')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target as HTMLSelectElement
    changeLanguage(value as Language)
    browserStorage(local, 'language', value)
  }

  return (
    <div className="container">
      <header>
        <span>
          <button
            aria-label={appLayoutLanguage.app_info_label}
            data-testid="app-info"
            onClick={handleInfoClick}
            className="info"
          >
            ?
          </button>
        </span>
        <span>
          <NavLink to="/" data-testid="home-link">
            <img
              className="train-icon"
              src="/train-icon.png"
              alt="train icon"
            />
          </NavLink>
        </span>
        <span>
          <label htmlFor="language-menu" className="invisible-label">
            Language
          </label>
          <select id="language-menu" onChange={handleChange}>
            <option value="SR">🇷🇸</option>
            <option value="EN">🇬🇧</option>
          </select>
        </span>
      </header>
      <DeparturesContextProvider>
        <Outlet />
      </DeparturesContextProvider>
    </div>
  )
}

export default AppLayout
