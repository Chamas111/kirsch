import { useState } from "react";
import axios from "../../axiosinstance";
import { useLocation, useNavigate } from "react-router-dom";
import "./newlagerung.css";
function NewLager() {
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = location.state?.eventId;
  // ✅ Pre-fill date if passed from Calendar
  const preselectedDate = location.state?.selectedDate || "";

  const [kundeName, setKundeName] = useState("");
  const [lager, setLager] = useState("");

  const [datum, setDatum] = useState("");

  const [employeeName, setEmployeeName] = useState("");

  const [notitz, setNotitz] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newHvz = {
      kundeName,
      datum,
      lager,
      employeeName,
      notitz,
    };

    await axios.post(
      `${process.env.REACT_APP_SERVER_BASE_URL}/api/lagerungs`,
      newHvz,
      {
        withCredentials: true, // send cookies
      }
    );

    navigate("/lagerung");
  };

  return (
    <div className="newLagerung">
      <div className="d-flex justify-content-center mx-auto p-2 pt-5 mt-5 contentLager">
        <form
          onSubmit={handleSubmit}
          className="w-100"
          style={{ maxWidth: "700px" }}
        >
          <h2 className="text-center p-2 ">Einen neuen Lager hinzufügen</h2>
          {/* Datum */}
          <div className="row mb-3">
            <label
              htmlFor="inputdatum"
              className="col-12 col-md-4 col-form-label fw-bold"
            >
              Datum
            </label>
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="dd.mm.yyyy"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
              />
            </div>
          </div>

          {/* Kunde */}
          <div className="row mb-3">
            <label
              htmlFor="inputkunde"
              className="col-12 col-md-4 col-form-label fw-bold"
            >
              Kunde
            </label>
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control"
                value={kundeName}
                onChange={(e) => setKundeName(e.target.value)}
              />
            </div>
          </div>

          {/* Lager Place */}
          <div className="row mb-3">
            <label
              htmlFor="inputLagerPlace"
              className="col-12 col-md-4 col-form-label fw-bold"
            >
              Lager Place
            </label>
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control"
                value={lager}
                onChange={(e) => setLager(e.target.value)}
              />
            </div>
          </div>

          {/* Mitarbeiter */}
          <div className="row mb-3">
            <label
              htmlFor="mitarbeiter"
              className="col-12 col-md-4 col-form-label fw-bold"
            >
              Mitarbeiter
            </label>
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>
          </div>

          {/* Notitz */}
          <div className="row mb-3">
            <label htmlFor="Notitz" className="col-12 fw-bold">
              Notitz
            </label>
            <div className="col-12">
              <textarea
                name="message"
                rows="5"
                className="form-control"
                value={notitz}
                onChange={(e) => setNotitz(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex flex-column flex-sm-row gap-2 mt-3">
            <button type="submit" className="btn btn-primary w-100 w-sm-auto">
              Add Lager
            </button>
            <button
              type="button"
              onClick={() => navigate("/lagerung")}
              className="btn btn-secondary w-100 w-sm-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewLager;
