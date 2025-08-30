import { useState, useEffect } from "react";
import axios from "../../axiosinstance";
import { useNavigate, useParams } from "react-router-dom";
import "./updateausgaben.css";
function UpdateAusgabe() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [anbieter, setAnbieter] = useState("");
  const [datum, setDatum] = useState("");
  const [rechnungsNummer, setRechnungsNummer] = useState("");
  const [betrag, setBetrag] = useState("");

  // Load existing ausgabe
  useEffect(() => {
    const fetchAusgabe = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/ausgaben/${id}`,
          { withCredentials: true }
        );
        const ausgabe = res.data;
        setAnbieter(ausgabe.anbieter || "");
        setRechnungsNummer(ausgabe.rechnungsNummer || "");
        setBetrag(ausgabe.betrag || "");

        // Format date back to dd.mm.yyyy
        if (ausgabe.datum) {
          const dateObj = new Date(ausgabe.datum);
          const formatted = dateObj
            .toLocaleDateString("de-DE")
            .split(".")
            .map((part) => part.padStart(2, "0"))
            .join(".");
          setDatum(formatted);
        }
      } catch (err) {
        console.error("Error loading ausgabe:", err);
      }
    };
    fetchAusgabe();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert dd.mm.yyyy back to Date
    const [day, month, year] = datum.split(".");
    const isoDate = new Date(`${year}-${month}-${day}`);

    const updatedAusgabe = {
      datum: isoDate,
      anbieter,
      rechnungsNummer,
      betrag,
    };

    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/ausgaben/${id}`,
        updatedAusgabe,
        { withCredentials: true }
      );
      navigate("/ausgaben");
    } catch (err) {
      console.error("Error updating ausgabe:", err);
    }
  };

  return (
    <div className="updateAusgaben">
      <div className="d-flex justify-content-center mx-auto p-2 contentUpdateAusgaben">
        <form onSubmit={handleSubmit}>
          <h2 className="mx-auto p-2 pt-5 mt-5 title">Ausgabe bearbeiten</h2>
          {/* Datum */}
          <div className="row mb-3 p-2">
            <label className="col-sm-12 col-md-4 col-form-label fw-bold">
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
            <label className="col-sm-12 col-md-4 col-form-label fw-bold">
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
          <div className="row mb-3 align-items-center">
            <label className="col-sm-12 col-md-4 col-form-label fw-bold">
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
            <label className="col-sm-12 col-md-4 col-form-label fw-bold">
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

          <button type="submit" className=" btn btn-primary">
            Update Ausgabe
          </button>
          <button
            type="button"
            onClick={() => navigate("/ausgaben")}
            className="btn btn-secondary"
            style={{ marginLeft: "10px", color: "white" }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateAusgabe;
