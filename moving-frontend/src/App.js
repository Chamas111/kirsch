import { useState, useEffect } from "react";
import axios from "../src/axiosinstance";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import moment from "moment";
import { momentLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarPage from "./components/CalendarPage";
import NewAuftrag from "./components/NewAuftrag";
import AuftragDetails from "./components/AuftragDetails";
import UpdateAuftrag from "./components/UpdateAuftrag";
import Auftraege from "./components/Auftraege";

import Home from "./pages/home/Home";
import User from "./pages/user/User";
import Kalendar from "./pages/kalendar/Kalendar";

import Hvz from "./pages/hvz/Hvz";
import Rechnungen from "./pages/rechnungen/Rechnungen";
import Ausgaben from "./pages/ausgaben/Ausgaben";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import SearchResults from "./components/SearchResult";
import Lagerung from "./pages/lagerung/Lagerung";
import Login from "./pages/login/Login";
import "./styles/global.css";
import Register from "./pages/register/Register";
import NewHvz from "./pages/hvz/NewHvz";
import UpdateHvz from "./pages/hvz/UpdateHvz";
import NewLager from "./pages/lagerung/NewLager";
import UpdateLager from "./pages/lagerung/UpdateLager";
import NewAusgabe from "./pages/ausgaben/NewAusgabe";
import UpdateAusgabe from "./pages/ausgaben/UpdateAusgabe";
import NewRechnung from "./pages/rechnungen/NewRechnung";
import UpdateRechnung from "./pages/rechnungen/UpdateRechnung";
import LagerRechnungen from "./pages/rechnungen/LagerRechnungen";

const localizer = momentLocalizer(moment);

const Layout = ({ isLoggedin, setIsLoggedin }) => {
  const location = useLocation();
  const isHvzPage = location.pathname.startsWith("/hvz");
  const isHomePage = location.pathname === "/";
  const isCalendarPage = location.pathname.startsWith("/calendar");
  return (
    <div className="main">
      <Navbar isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} />
      <div className="container ">
        <div className="menuContainer">
          <Menu />
        </div>

        <div
          className={`contentContainer p-2 
        ${isHvzPage ? " " : ""} 
        ${isHomePage ? "contentContainerHome p-2" : ""} 
       
        ${!isHvzPage && !isHomePage ? "default-class" : ""}
      `}
          style={{
            background: "linear-gradient(to right, #5f5e75ff, #5f5e75ff)",
          }}
        >
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

// PrivateRoute now renders Layout + children
const PrivateRoute = ({ isLoggedin }) => {
  console.log("PrivateRoute check — isLoggedin:", isLoggedin);
  return isLoggedin ? <Outlet /> : <Navigate to="/login" />;
};
function App() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/auth/me", { withCredentials: true })
      .then((res) => {
        console.log("Logged in user:", res.data);
        setIsLoggedin(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Not logged in:", err.response?.data || err.message);
        setIsLoggedin(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // prevent redirect while checking
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={<Login setIsLoggedin={setIsLoggedin} />}
        />
        <Route path="/register" element={<Register />} />

        {/* Private */}
        <Route element={<PrivateRoute isLoggedin={isLoggedin} />}>
          <Route
            element={
              <Layout isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} />
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<User />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/calendar/new" element={<NewAuftrag />} />
            <Route path="/auftrag/:id" element={<AuftragDetails />} />
            <Route path="/auftraege/:id/update" element={<UpdateAuftrag />} />
            <Route path="/hvz" element={<Hvz />} />
            <Route path="/hvz/new" element={<NewHvz />} />
            <Route path="/hvz/:id/update" element={<UpdateHvz />} />
            <Route path="/rechnungen" element={<Rechnungen />} />
            <Route path="/rechnungen/lager" element={<LagerRechnungen />} />
            <Route path="/rechnungen/new" element={<NewRechnung />} />
            <Route path="/rechnungen/:id/update" element={<UpdateRechnung />} />
            <Route path="/ausgaben" element={<Ausgaben />} />
            <Route path="/ausgaben/new" element={<NewAusgabe />} />
            <Route path="/ausgaben/:id/update" element={<UpdateAusgabe />} />
            <Route path="/lagerung" element={<Lagerung />} />
            <Route path="/lagerung/new" element={<NewLager />} />
            <Route path="/lagerung/:id/update" element={<UpdateLager />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
