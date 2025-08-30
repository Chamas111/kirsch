import { useState } from "react";
import axios from "../../axiosinstance";
import { useLocation, useNavigate } from "react-router-dom";
import "./newhvz.css";
function NewHvz() {
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = location.state?.eventId;
  // ✅ Pre-fill date if passed from Calendar
  const preselectedDate = location.state?.selectedDate || "";

  const [kundeName, setKundeName] = useState("");
  const [straße, setStraße] = useState("");

  const [datum, setDatum] = useState("");
  const [status, setStatus] = useState("Nicht bestellt");

  const [hvzName, setHvzName] = useState("");

  const [classification, setClassification] = useState("Privat");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newHvz = {
      kundeName,
      datum,
      straße,
      status,
      classification,
      hvzName,
    };

    await axios.post(
      `${process.env.REACT_APP_SERVER_BASE_URL}/api/hvzs`,
      newHvz,
      {
        withCredentials: true, // send cookies
      }
    );

    navigate("/hvz");
  };

  return (
    <div className="newHvz ">
      <div className="d-flex justify-content-center mx-auto p-2 pt-5 mt-5 content">
        <form
          onSubmit={handleSubmit}
          className="w-100"
          style={{ maxWidth: "700px" }}
        >
          <h2 className="text-center p-2 title ">Einen neuen HVZ hinzufügen</h2>
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

          {/* Classification */}
          <div className="row mb-3">
            <label
              htmlFor="inputClassification"
              className="col-12 col-md-4 col-form-label fw-bold"
            >
              Classification
            </label>
            <div className="col-12 col-md-8">
              <select
                className="form-select"
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
              >
                <option value="Privat">Privat</option>
                <option value="Rechnung">Rechnung</option>
              </select>
            </div>
          </div>

          {/* Adresse */}
          <div className="row mb-3">
            <label
              htmlFor="inputAdresse"
              className="col-12 col-md-4 col-form-label fw-bold"
            >
              Adresse
            </label>
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control"
                value={straße}
                onChange={(e) => setStraße(e.target.value)}
              />
            </div>
          </div>

          {/* Kunde */}
          <div className="row mb-3">
            <label
              htmlFor="kundeName"
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

          {/* Status */}
          <div className="row mb-3">
            <label
              htmlFor="inputStatus"
              className="col-12 col-md-4 col-form-label fw-bold"
            >
              Status
            </label>
            <div className="col-12 col-md-8">
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Nicht bestellt">Nicht bestellt</option>
                <option value="Bestellt">Bestellt</option>
                <option value="Genehmigt">Genehmigt</option>
                <option value="Abgelehnt">Abgelehnt</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
            <button type="submit" className="btn btn-primary w-100 w-sm-auto">
              Add HVZ
            </button>
            <button
              type="button"
              onClick={() => navigate("/hvz")}
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

export default NewHvz;
