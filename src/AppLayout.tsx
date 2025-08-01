import { NavLink, Outlet, useNavigate, useLocation } from "react-router"
import { DeparturesContextProvider } from "./context/DeparturesContext";

function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    function handleInfoClick() {
      if (location.pathname === "/info") {
        navigate(-1);
      } else {
        navigate("/info");
      }
    }
    return (
        <div className="container">
          <header>
            <span>&#10210;</span>
            <NavLink to="/" aria-label="home">
              <img className="train-icon" src="/train-icon.png" alt="train icon" />
            </NavLink>
            <span>
              <button
                aria-label="more info"
                onClick={handleInfoClick}
                className="info"
              >
                ?
              </button>
            </span>
          </header>
          <DeparturesContextProvider>
            <Outlet />
          </DeparturesContextProvider>
        </div>
      );
}

export default AppLayout;