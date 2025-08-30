import React, { useState } from "react";
import axios from "../axiosinstance";
import { useLocation, useNavigate } from "react-router-dom";
import "./newAuftrag.css";
function NewAuftrag() {
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = location.state?.eventId;
  // ✅ Pre-fill date if passed from Calendar
  const preselectedDate = location.state?.selectedDate || "";

  const [title, setTitle] = useState("");
  const [start, setStart] = useState(preselectedDate);
  const [end, setEnd] = useState("");
  const [datum, setDatum] = useState("");
  const [uhrZeit, setUhrZeit] = useState("");
  const [kundeName, setkundeName] = useState("");
  const [tel, setTel] = useState("");
  const [auszugsadresse, setAuszugsadresse] = useState("");
  const [auszugsEtage, setAuszugsEtage] = useState("EG");
  const [auszugsAufzug, setAuszugsAufzug] = useState("");
  const [einzugsadresse, setEinzugsadresse] = useState("");
  const [einzugsEtage, setEinzugsEtage] = useState("EG");
  const [einzugsAufzug, setEinzugsAufzug] = useState("");
  const [preis, setPreis] = useState("");
  const [hvz, setHvz] = useState("");
  const [bezahlMethod, setBezahlMethod] = useState("Bezahlung in bar");
  const [bemerkungen, setBemerkungen] = useState("");
  const [umzugsListe, setUmzugsListe] = useState("");
  const [auszugHvz, setAuszugHvz] = useState(false);
  const [einzugHvz, setEinzugHvz] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAuftrag = {
      title,
      start,
      end,
      kundeName,

      datum,
      uhrZeit,

      tel,
      auszugsadresse,
      auszugsEtage,
      auszugsAufzug,
      einzugsadresse,
      einzugsEtage,
      einzugsAufzug,
      preis,
      hvz,

      auszugHvz,
      einzugHvz,
      umzugsListe,
      bezahlMethod,
      bemerkungen,
      eventId,
    };

    await axios.post(
      `${process.env.REACT_APP_SERVER_BASE_URL}/api/auftraege`,
      newAuftrag,
      {
        withCredentials: true, // send cookies
      }
    );

    navigate("/calendar"); // Redirect back to calendar after save
  };

  return (
    <div className="newAuftrag">
      <div className="d-flex justify-content-center mx-auto p-2 contentAuftrag">
        <form onSubmit={handleSubmit}>
          <h2 className="mx-auto p-2 mt-4 pt-5 title">
            Einen neuen Auftrag hinzufügen
          </h2>
          <div className="row mb-3">
            <label
              htmlFor="inputtitle"
              className="col-sm-2 col-form-label fw-bold"
            >
              Title
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <label
              htmlFor="inputtitle"
              className="col-sm-2 col-form-label fw-bold"
            >
              Start date
            </label>
            <div className="col-sm-10">
              <input
                type="datetime-local"
                className="form-control"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <label
              htmlFor="inputtitle"
              className="col-sm-2 col-form-label fw-bold"
            >
              End date
            </label>
            <div className="col-sm-10">
              <input
                type="datetime-local"
                className="form-control"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Datum */}
          <div className="row mb-3">
            <label
              htmlFor="inputDatum"
              className="col-sm-2 col-form-label fw-bold"
            >
              Datum
            </label>

            <div className="col-sm-10">
              <input
                type="Date"
                className="form-control"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
              />
            </div>
          </div>
          {/* Uhrzeit */}
          <div className="row mb-3">
            <label
              htmlFor="inputZeit"
              className="col-sm-2 col-form-label fw-bold"
            >
              Uhrzeit
            </label>
            <div className="col-sm-10">
              <input
                type="time"
                className="form-control"
                value={uhrZeit}
                onChange={(e) => setUhrZeit(e.target.value)}
              />
            </div>
          </div>
          {/* Kunde */}
          <div className="row mb-3">
            <label
              htmlFor="inputKunde"
              className="col-sm-2 col-form-label fw-bold"
            >
              Kunde
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                value={kundeName}
                onChange={(e) => setkundeName(e.target.value)}
              />
            </div>
          </div>
          {/* Telefon */}
          <div className="row mb-3 ">
            <label
              htmlFor="inputTele"
              className="col-sm-2 col-form-label fw-bold"
            >
              Tele
            </label>
            <div className="col-sm-10">
              <input
                type="number"
                className="form-control "
                value={tel}
                onChange={(e) => setTel(e.target.value)}
              />
            </div>
          </div>
          {/* Auszug */}
          <div className="d-flex flex-column gap-3">
            <div className="container mt-4 card p-4 shadow-sm ">
              <div className="row mb-3">
                <label
                  htmlFor="inputAuzAdress"
                  className="form-label fw-bold text-center pt-1"
                >
                  Auszug Adresse
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    value={auszugsadresse}
                    onChange={(e) => setAuszugsadresse(e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3 ">
                <label
                  htmlFor="inputEtage1"
                  className="form-label col-sm-2 col-form-label fw-bold d-flex justify-content-center"
                >
                  Etage
                </label>
                <div className="col-sm-10">
                  <select
                    className="form-select form-control"
                    value={auszugsEtage}
                    onChange={(e) => setAuszugsEtage(e.target.value)}
                  >
                    <option defaultValue>EG</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>Haus</option>
                    <option>Hochparterre</option>
                  </select>
                </div>
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={auszugsAufzug === "mit Aufzug"}
                    onChange={(e) =>
                      setAuszugsAufzug(
                        e.target.checked ? "mit Aufzug" : "ohne Aufzug"
                      )
                    }
                  />
                  <label
                    className="form-check-label fw-bold"
                    htmlFor="auszugsAufzug"
                  >
                    Aufzug
                  </label>
                </div>
              </div>

              <div className="col-12 ">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={auszugHvz}
                    onChange={(e) => setAuszugHvz(e.target.checked)}
                  />
                  <label
                    className="form-check-label fw-bold"
                    htmlFor="auszugHvz"
                  >
                    HVZ in der Auszugadresse
                  </label>
                </div>
              </div>
            </div>
            {/* Einzug */}
            <div className="container mt-4 card p-4 shadow-sm">
              <div className="row mb-3 ">
                <label
                  htmlFor="inputEinAdress"
                  className="form-label fw-bold text-center pt-1"
                >
                  Einzug Adresse
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    value={einzugsadresse}
                    onChange={(e) => setEinzugsadresse(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="inputEtage2"
                  className="form-label col-sm-2 col-form-label fw-bold d-flex justify-content-center"
                >
                  Etage
                </label>
                <div className="col-sm-10">
                  <select
                    className="form-select form-control"
                    value={einzugsEtage}
                    onChange={(e) => setEinzugsEtage(e.target.value)}
                  >
                    <option defaultValue>EG</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>Haus</option>
                    <option>Hochparterre</option>
                  </select>
                </div>
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={einzugsAufzug === "mit Aufzug"}
                    onChange={(e) =>
                      setEinzugsAufzug(
                        e.target.checked ? "mit Aufzug" : "ohne Aufzug"
                      )
                    }
                  />
                  <label
                    className="form-check-label fw-bold"
                    htmlFor="einzugsAufzug"
                  >
                    Aufzug
                  </label>
                </div>
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={einzugHvz}
                    onChange={(e) => setEinzugHvz(e.target.checked)}
                  />
                  <label
                    className="form-check-label fw-bold"
                    htmlFor="einzugHvz"
                  >
                    HVZ in der Auszugadresse
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Umzugsliste */}
          <div className="row mb-3 p-2">
            <label htmlFor="Bemerkungen" className="form-label fw-bold">
              Umzugsliste
            </label>
            <textarea
              type="text"
              name="message"
              rows="10"
              cols="30"
              className="form-control"
              value={umzugsListe}
              onChange={(e) => setUmzugsListe(e.target.value)}
            />
          </div>
          {/* Preis + HVZ */}
          <div className="container mt-4 column-gap-2">
            <div className="row mb-3">
              <label
                htmlFor="inputPreis"
                className="col-sm-2 col-form-label fw-bold"
              >
                Preis
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control "
                  value={preis}
                  onChange={(e) => setPreis(e.target.value)}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="inputHvz"
                className="col-sm-2 col-form-label fw-bold"
              >
                HVZ
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={hvz}
                  onChange={(e) => setHvz(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="inputPament" className="form-label fw-bold">
              Payment Method
            </label>

            <select
              className="form-select form-control"
              value={bezahlMethod}
              onChange={(e) => setBezahlMethod(e.target.value)}
            >
              <option value="Bezahlung in bar">Bezahlung in bar</option>
              <option value="Überweisung">Überweisung</option>
              <option value="Sofort Überweisung">Sofort Überweisung</option>
            </select>
          </div>

          <div className="row mb-3 p-2">
            <label htmlFor="Bemerkungen" className="form-label fw-bold">
              Bemerkungen
            </label>
            <textarea
              type="text"
              name="message"
              rows="10"
              cols="30"
              className="form-control"
              value={bemerkungen}
              onChange={(e) => setBemerkungen(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Add Auftrag
          </button>
          <button
            type="button"
            onClick={() => navigate("/calendar")}
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

export default NewAuftrag;
