import { useState } from "react";
import axios from "../../axiosinstance";
import { useLocation, useNavigate } from "react-router-dom";
import "./newAusgaben.css";
function NewAusgabe() {
  const location = useLocation();
  const navigate = useNavigate();

  const preselectedDate = location.state?.selectedDate || "";

  const [anbieter, setAnbieter] = useState("");
  const [datum, setDatum] = useState(preselectedDate);
  const [rechnungsNummer, setRechnungsNummer] = useState("");
  const [betrag, setBetrag] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert to Date object before sending
    const [day, month, year] = datum.split(".");
    const isoDate = new Date(`${year}-${month}-${day}`);

    const newAusgabe = {
      datum: isoDate,
      anbieter,
      rechnungsNummer,
      betrag,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/ausgaben`,
        newAusgabe,
        { withCredentials: true }
      );
      navigate("/ausgaben");
    } catch (err) {
      console.error("Error creating ausgabe:", err);
    }
  };

  return (
    <div className="newAusgaben">
      <div className="d-flex justify-content-center mx-auto p-2 pt-5 mt-5 contentAusgaben">
        <form
          onSubmit={handleSubmit}
          className="w-100 "
          style={{ maxWidth: "700px" }}
        >
          <h2 className="text-center title">Einen neuen Ausgabe hinzufügen</h2>
          {/* Datum */}
          <div className="row mb-3">
            <label className="col-12 col-md-4 col-form-label fw-bold">
              Datum
            </label>
            <div className="col-12 col-md-8">
              <input
                pattern="\d{2}\.\d{2}\.\d{4}"
                required
                type="text"
                placeholder="dd.mm.yyyy"
                className="form-control"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
              />
            </div>
          </div>

          {/* RechnungsNummer */}
          <div className="row mb-3">
            <label className="col-12 col-md-4 col-form-label fw-bold">
              Rechnungs Nummer
            </label>
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control"
                value={rechnungsNummer}
                onChange={(e) => setRechnungsNummer(e.target.value)}
              />
            </div>
          </div>

          {/* Anbieter */}
          <div className="row mb-3">
            <label className="col-12 col-md-4 col-form-label fw-bold">
              Anbieter
            </label>
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control"
                value={anbieter}
                onChange={(e) => setAnbieter(e.target.value)}
              />
            </div>
          </div>

          {/* Betrag */}
          <div className="row mb-3">
            <label className="col-12 col-md-4 col-form-label fw-bold">
              Betrag
            </label>
            <div className="col-12 col-md-8">
              <input
                type="text"
                placeholder="ex. 120€"
                className="form-control"
                value={betrag}
                onChange={(e) => setBetrag(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex flex-column flex-sm-row gap-2 mt-3 ausgabenbutton">
            <button type="submit" className="btn btn-primary w-100 w-sm-auto">
              Add Ausgabe
            </button>
            <button
              type="button"
              onClick={() => navigate("/ausgaben")}
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

export default NewAusgabe;
