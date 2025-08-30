import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axiosinstance";
import "./updatelagerung.css";
function UpdateLager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lager, setLager] = useState({
    kundeName: "",
    datum: "",
    lager: "",
    employeeName: "",
    notitz: "",
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/lagerungs/${id}`, {
        withCredentials: true,
      })
      .then((res) => setLager(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setLager({ ...lager, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/lagerungs/${id}`,
        lager,
        { withCredentials: true }
      );
      alert("Lager updated successfully!");
      navigate("/lagerung");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="updateLagerung">
      <div className="d-flex justify-content-center mx-auto p-2 pt-5 mt-5 contentupdateLagerung">
        <form onSubmit={handleSubmit}>
          <h2 className="mx-auto p-3 pt-2 title ">Lager bearbeiten</h2>
          <div className="row mb-3 ">
            <label
              htmlFor="inputdatum"
              className="col-sm-12 col-md-4 col-form-label fw-bold"
            >
              Datum
            </label>
            <div className="col-12 col-md-8">
              <input
                name="datum"
                type="text"
                className="form-control"
                placeholder="dd.mm.yyyy"
                value={lager.datum}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label
              htmlFor="inputClassification"
              className="col-sm-12 col-md-4 col-form-label fw-bold"
            >
              kunde
            </label>

            <div className="col-12 col-md-8">
              <input
                type="text"
                name="kundeNamen"
                className="form-control w-100"
                value={lager.kundeName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label
              htmlFor="inputAdresse"
              className="col-sm-12 col-md-4 col-form-label fw-bold"
            >
              Lager Place
            </label>
            <div className="col-12 col-md-8">
              <input
                name="lager"
                type="text"
                className="form-control"
                value={lager.lager}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label
              htmlFor="employeeName"
              className="col-sm-12 col-md-4 col-form-label fw-bold"
            >
              kunde
            </label>

            <div className="col-12 col-md-8">
              <input
                name="employeeName"
                type="text"
                className="form-control"
                value={lager.employeeName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* <div className="row mb-3 align-items-center p-2">
          <label
            htmlFor="inputNotitz"
            className="col-sm-2 col-form-label fw-bold"
          >
            Notitz
          </label>
          <div className="col-sm-10 col-md-8">
            <input
              type="text"
              name="notitz"
              className="form-select form-control"
              value={lager.notitz}
              onChange={handleChange}
            />
          </div>
        </div> */}
          <div className="row mb-3">
            <label htmlFor="Notitz" className="form-label fw-bold">
              Notitz
            </label>
            <textarea
              type="text"
              name="notitz"
              rows="10"
              cols="30"
              className="form-control"
              value={lager.notitz}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success ">
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/lagerung")}
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

export default UpdateLager;
