import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axiosinstance";
import "./updatehvz.css";
function UpdateHvz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hvz, setHvz] = useState({
    datum: "",
    classification: "",
    straße: "",
    kundeName: "",
    status: "",
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/hvzs/${id}`, {
        withCredentials: true,
      })
      .then((res) => setHvz(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setHvz({ ...hvz, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/hvzs/${id}`,
        hvz,
        { withCredentials: true }
      );
      alert("HVZ updated successfully!");
      navigate("/hvz");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="updateRechnung">
      <div className="d-flex justify-content-center mx-auto p-2 pt-5 mt-5 contentupdate">
        <form
          onSubmit={handleSubmit}
          className="w-100"
          style={{ maxWidth: "800px" }}
        >
          <h2 className="p-2 title text-center">HVZ bearbeiten</h2>

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
                name="datum"
                type="text"
                className="form-control"
                placeholder="dd.mm.yyyy"
                value={hvz.datum}
                onChange={handleChange}
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
                name="classification"
                className="form-select"
                value={hvz.classification}
                onChange={handleChange}
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
                name="straße"
                type="text"
                className="form-control"
                value={hvz.straße}
                onChange={handleChange}
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
                name="kundeName"
                type="text"
                className="form-control"
                value={hvz.kundeName}
                onChange={handleChange}
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
                name="status"
                className="form-select"
                value={hvz.status}
                onChange={handleChange}
              >
                <option value="Nicht bestellt">Nicht bestellt</option>
                <option value="Bestellt">Bestellt</option>
                <option value="Genehmigt">Genehmigt</option>
                <option value="Abgelehnt">Abgelehnt</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end mt-3 justify-content-center">
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate("/hvz")}
              className="btn btn-secondary ms-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateHvz;
