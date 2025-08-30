import { useState } from "react";
import axios from "../../axiosinstance";
import { useLocation, useNavigate } from "react-router-dom";
import "./newRechnung.css";
function NewRechnung() {
  const location = useLocation();
  const navigate = useNavigate();

  const preselectedDate = location.state?.selectedDate || "";

  // ✅ Default values are now correct
  const [rechnungsDatum, setRechnungsDatum] = useState(preselectedDate);
  const [status, setStatus] = useState("Überweisung");
  const [rechnungsNummer, setRechnungsNummer] = useState("");
  const [kundeName, setKundeName] = useState("");
  const [faellig, setFaellig] = useState("");
  const [nettoBetrag, setNettoBetrag] = useState("");
  const [mwst, setMwst] = useState("");
  const [brutto, setBrutto] = useState("");
  const [isLager, setIsLager] = useState(false);

  const VAT_RATE = 0.19; // 19%
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check date format before sending
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(rechnungsDatum)) {
      alert("Bitte geben Sie das Datum im Format TT.MM.JJJJ ein");
      return;
    }

    const [day, month, year] = rechnungsDatum.split(".");
    const isoDate = new Date(`${year}-${month}-${day}`);

    // ✅ Convert number fields properly
    const newRechnung = {
      rechnungsDatum: isoDate,
      rechnungsNummer: rechnungsNummer.trim(),
      kundeName,
      status: status.trim(),
      nettoBetrag: Number(nettoBetrag),
      mwst: Number(mwst),
      brutto: Number(brutto),
      faellig,
      isLager: isLager,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/invoices`,
        newRechnung,
        { withCredentials: true }
      );
      navigate("/rechnungen");
    } catch (err) {
      console.error("❌ Error creating rechnung:", err.response?.data || err);
      alert(
        "Fehler beim Erstellen der Rechnung. Bitte prüfen Sie die Eingaben."
      );
    }
  };

  const handleNettoChange = (e) => {
    const nettoValue = parseFloat(e.target.value) || 0;
    setNettoBetrag(nettoValue);

    const calculatedMwst = nettoValue * VAT_RATE;
    const calculatedBrutto = nettoValue + calculatedMwst;

    // Round to 2 decimals
    setMwst(calculatedMwst.toFixed(2));
    setBrutto(calculatedBrutto.toFixed(2));
  };
  return (
    <div className="newRechnung">
      <div className="d-flex justify-content-center mx-auto p-2 pt-5 mt-5 contentRechnung">
        <form
          onSubmit={handleSubmit}
          className="w-100"
          style={{ maxWidth: "700px" }}
        >
          <h2 className="text-center pt-2 mt-3 mb-4 title">
            Einen neuen Rechnung hinzufügen
          </h2>
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
                value={rechnungsDatum}
                onChange={(e) => setRechnungsDatum(e.target.value)}
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
                required
              />
            </div>
          </div>

          {/* Kunde */}
          <div className="row mb-3">
            <label className="col-12 col-md-4 col-form-label fw-bold">
              Kunde Name
            </label>
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control"
                value={kundeName}
                onChange={(e) => setKundeName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="row mb-3">
            <label className="col-12 col-md-4 col-form-label fw-bold">
              Status
            </label>
            <div className="col-12 col-md-8">
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value.trim())}
              >
                <option value="Überweisung">Überweisung</option>
                <option value="Bezahlt">Bezahlt</option>
                <option value="Cash">Cash</option>
                <option value="Storniert">Storniert</option>
              </select>
            </div>
          </div>

          {/* Netto */}
          <div className="row mb-3">
            <label className="col-12 col-md-4 col-form-label fw-bold">
              Netto
            </label>
            <div className="col-12 col-md-8">
              <input
                type="number"
                placeholder="ex. 120"
                className="form-control"
                value={nettoBetrag}
                onChange={handleNettoChange}
                required
              />
            </div>
          </div>

          {/* MwSt */}
          <div className="row mb-3">
            <label className="col-12 col-md-4 col-form-label fw-bold">
              MwSt
            </label>
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control"
                value={mwst}
                readOnly
                style={{ backgroundColor: "gray", cursor: "not-allowed" }}
              />
            </div>
          </div>

          {/* Brutto */}
          <div className="row mb-3">
            <label className="col-12 col-md-4 col-form-label fw-bold">
              Brutto
            </label>
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control"
                value={brutto}
                readOnly
                style={{ backgroundColor: "gray", cursor: "not-allowed" }}
              />
            </div>
          </div>

          {/* Fällig */}
          <div className="row mb-3">
            <label className="col-12 col-md-4 col-form-label fw-bold">
              Fällig
            </label>
            <div className="col-12 col-md-8">
              <select
                className="form-select"
                value={faellig}
                onChange={(e) => setFaellig(e.target.value.trim())}
              >
                <option value="">-- auswählen --</option>
                <option value="Erinnerung gesendet">Erinnerung gesendet</option>
                <option value="Erinnerung">Erinnerung</option>
                <option value="<15 Tage">&lt;15 Tage</option>
                <option value="-">-</option>
              </select>
            </div>
          </div>

          {/* Lager Rechnung */}
          <div className="row mb-3">
            <label className="col-12 col-md-4 col-form-label fw-bold">
              Lager Rechnung
            </label>
            <div className="col-12 col-md-8 d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input"
                checked={isLager}
                onChange={(e) => setIsLager(e.target.checked)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex flex-column flex-sm-row gap-2 mt-3">
            <button type="submit" className="btn btn-primary w-100 w-sm-auto">
              Add Rechnung
            </button>
            <button
              type="button"
              onClick={() => navigate("/rechnungen")}
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

export default NewRechnung;
