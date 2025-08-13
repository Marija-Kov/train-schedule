import { NavLink, Outlet, useNavigate, useLocation } from "react-router"
import { DeparturesContextProvider } from "./context/DeparturesContext";
import { LanguageContext } from "./context/LanguageContext";
import { useContext } from "react";

type Language = "SR" | "EN";

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { changeLanguage } = useContext(LanguageContext);

  function handleInfoClick() {
    if (location.pathname === "/info") {
      navigate(-1);
    } else {
      navigate("/info");
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target as HTMLSelectElement;
    changeLanguage(value as Language);
  }

  return (
    <div className="container">
      <header>
        <span>&#10210;</span>
        <NavLink to="/" data-testid="home-link">
          <img className="train-icon" src="/train-icon.png" alt="train icon" />
        </NavLink>
        <span>
          <button
            data-testid="app-info"
            onClick={handleInfoClick}
            className="info"
          >
            ?
          </button>
        </span>
        <select id="language-menu" onChange={handleChange}>
          <option value="SR">SR</option>
          <option value="EN">EN</option>
        </select>
      </header>
      <DeparturesContextProvider>
        <Outlet />
      </DeparturesContextProvider>
    </div>
  );
}

export default AppLayout;