import { useState, useEffect } from "react";
import axios from "../axiosinstance";
import { useParams, useNavigate } from "react-router-dom";
import "./updateAuftrag.css";
const formatGermanDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

function UpdateAuftrag() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [auftrag, setAuftrag] = useState({
    title: "",
    datum: "",
    uhrZeit: "",
    kundeName: "",
    tel: "",
    auszugsadresse: "",
    auszugsEtage: "",
    auszugsAufzug: "ohne Aufzug",
    auszugHvz: false,
    einzugsadresse: "",
    einzugsEtage: "",
    einzugsAufzug: "ohne Aufzug",
    einzugHvz: false,
    preis: "",
    hvz: "",
    bezahlMethod: "",
    bemerkungen: "",
    umzugsListe: "",
  });

  // Load Auftrag from backend
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/auftraege/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;
        setAuftrag({
          ...data,
          auszugHvz: data.auszugHvz === true || data.auszugHvz === "true",
          einzugHvz: data.einzugHvz === true || data.einzugHvz === "true",
        });
      })
      .catch((e) => console.log(e));
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (name === "auszugHvz" || name === "einzugHvz") {
      setAuftrag((prev) => {
        const newAuftrag = { ...prev, [name]: checked };
        // build hvz string
        let hvzList = [];
        if (newAuftrag.auszugHvz) hvzList.push("Auszug");
        if (newAuftrag.einzugHvz) hvzList.push("Einzug");
        //newAuftrag.hvz = hvzList.join(", ");
        return newAuftrag;
      });
    } else if (name === "auszugsAufzug" || name === "einzugsAufzug") {
      setAuftrag((prev) => ({
        ...prev,
        [name]: checked ? "mit Aufzug" : "ohne Aufzug",
      }));
    } else {
      setAuftrag((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/auftraege/${id}`,
        auftrag,
        { withCredentials: true }
      )
      .then(() => navigate("/calendar"))
      .catch((e) => console.log(e));
  };

  return (
    <dic className="updateAuftrag">
      {/* Title */}

      <div className="d-flex justify-content-center mx-auto p-2 contentUpdateAuftrag">
        <form onSubmit={handleSubmit}>
          <h2 className="mx-auto p-2 mt-4 pt-5 title">Update Auftrag</h2>
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
                name="title"
                value={auftrag.title}
                onChange={handleChange}
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
                type="date"
                className="form-control"
                name="datum"
                value={formatGermanDate(auftrag.datum)}
                onChange={handleChange}
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
                name="uhrZeit"
                value={auftrag.uhrZeit}
                onChange={handleChange}
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
                name="kundeName"
                value={auftrag.kundeName}
                onChange={handleChange}
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
                className="form-control"
                name="tel"
                value={auftrag.tel}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Auszug */}
          <div className="d-flex flex-column gap-3">
            <div className="container mt-4 card p-4 shadow-sm">
              <div className="row mb-3 ">
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
                    name="auszugsadresse"
                    value={auftrag.auszugsadresse}
                    onChange={handleChange}
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
                    className="form-select"
                    name="auszugsEtage"
                    value={auftrag.auszugsEtage}
                    onChange={handleChange}
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
                    checked={auftrag.auszugsAufzug === "mit Aufzug"}
                    name="auszugsAufzug"
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label fw-bold"
                    htmlFor="auszugsAufzug"
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
                    checked={auftrag.auszugHvz}
                    name="auszugHvz"
                    onChange={handleChange}
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
                    name="einzugsadresse"
                    value={auftrag.einzugsadresse}
                    onChange={handleChange}
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
                    className="form-select"
                    name="einzugsEtage"
                    value={auftrag.einzugsEtage}
                    onChange={handleChange}
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
                    checked={auftrag.einzugsAufzug === "mit Aufzug"}
                    name="einzugsAufzug"
                    onChange={handleChange}
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
                    checked={auftrag.einzugHvz}
                    name="einzugHvz"
                    onChange={handleChange}
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
              name="umzugsListe"
              rows="6"
              className="form-control"
              value={auftrag.umzugsListe}
              onChange={handleChange}
            />
          </div>

          {/* Preis + HVZ */}
          <div className="container mt-4">
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
                  className="form-control"
                  name="preis"
                  value={auftrag.preis}
                  onChange={handleChange}
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
                  name="hvz"
                  value={auftrag.hvz}
                  readOnly
                />
              </div>
            </div>
          </div>
          {/* Payment */}
          <div className="row mb-3">
            <label htmlFor="inputPament" className="form-label fw-bold">
              Payment Method
            </label>

            <select
              className="form-select"
              name="bezahlMethod"
              value={auftrag.bezahlMethod}
              onChange={handleChange}
            >
              <option value="Bezahlung in bar">Bezahlung in bar</option>
              <option value="Überweisung">Überweisung</option>
              <option value="Sofort Überweisung">Sofort Überweisung</option>
            </select>
          </div>

          {/* Bemerkungen */}
          <div className="row mb-3 p-2">
            <label htmlFor="Bemerkungen" className="form-label fw-bold">
              Bemerkungen
            </label>
            <textarea
              name="bemerkungen"
              rows="5"
              className="form-control"
              value={auftrag.bemerkungen}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}

          <button type="submit" className="btn btn-success">
            Update Auftrag
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
    </dic>
  );
}

export default UpdateAuftrag;
