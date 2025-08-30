import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosinstance";
import "./auftragsDetails.css";
import arrow from "../components/navbar/fotos/reshot-icon-right-arrow-9NWDR8GZ2P.svg";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import logo from "../components/navbar/fotos/logo.svg";
function AuftragDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const printRef = useRef(null);
  const [arrowPng, setArrowPng] = useState(null);

  async function svgToPng(svgPath, width = 250, height = 250) {
    const response = await fetch(svgPath);
    const svgText = await response.text();

    return new Promise((resolve) => {
      const img = new Image();
      const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png"));
      };

      img.src = url;
    });
  }
  useEffect(() => {
    const convertArrow = async () => {
      const pngDataUrl = await svgToPng(arrow, 250, 250);
      setArrowPng(pngDataUrl);
    };
    convertArrow();
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/auftraege/${id}`, {
        withCredentials: true,
      })
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("Error fetching event:", err));
  }, [id]);

  const handleDownload = async () => {
    if (!printRef.current) return;

    // Small delay to ensure rendering is complete
    await new Promise((resolve) => setTimeout(resolve, 200));

    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff", // ensure white background
      ignoreElements: (el) => el.classList.contains("no-print"),
    });

    const data = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");

    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`auftrag-${event?._id || "details"}.pdf`);
  };

  if (!event) return <p>Loading...</p>;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/auftraege/${id}`,
          { withCredentials: true }
        );
        alert("Event deleted successfully!");
        navigate("/calendar");
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  return (
    <div className=" p-5 ">
      <div className="container-fluid">
        <div className="pt-5 mt-5 cardheader" ref={printRef}>
          <img
            src={logo}
            style={{ width: "15%", height: "15%" }}
            className="rounded-circle rounded mx-auto d-block mb-3 "
          />

          <div className="d-flex justify-content-center cardwidth event-details ">
            <div class="card text-bg-secondary mb-3 ">
              <div class="card-header text-center fw-bold text-white ">
                Auzugsadresse
              </div>
              <div class="card-body carddetail ">
                <p class="card-text">{event.title}</p>
                <p class="card-text">
                  <strong>Datum:</strong> {event.datum}
                </p>
                <p>
                  <strong>Uhrzeit:</strong> {event.uhrZeit}
                </p>
                <p>
                  <strong>Kunde:</strong> {event.kundeName}
                </p>
                <p>
                  <strong>tele:</strong> {event.tel}
                </p>
              </div>
              <div class="card-body ">
                <p>
                  <strong>Auszug Adresse:</strong> {event.auszugsadresse}
                </p>
                <p>
                  <strong>Etage:</strong> {event.auszugsEtage}
                </p>
                <p>
                  <strong>Aufzug:</strong>{" "}
                  {event.auszugsAufzug || "ohne Aufzug"}
                </p>
              </div>
            </div>
            <div class="d-flex flex-column justify-content-center ">
              {arrowPng && (
                <div className="d-flex flex-column ">
                  <img src={arrowPng} alt="arrow" className="arrow-img" />
                  <img src={arrowPng} alt="arrow" className="arrow-img" />
                </div>
              )}
            </div>
            <div
              class="card text-bg-secondary mb-3 "
              style={{ maxWidth: "18rem" }}
            >
              <div class="card-header text-center fw-bold ">Einzugsadresse</div>
              <div class="card-body carddetail">
                <div class="card-body">
                  <p class="">{event.title}</p>
                  <p class="">
                    <strong>Datum:</strong> {event.datum}
                  </p>
                  <p>
                    <strong>Uhrzeit:</strong> {event.uhrZeit}
                  </p>
                  <p>
                    <strong>Kunde:</strong> {event.kundeName}
                  </p>
                  <p>
                    <strong>tele:</strong> {event.tel}
                  </p>
                </div>
                <div class="card-body">
                  <p>
                    <strong>Einzug Adresse:</strong> {event.einzugsadresse}
                  </p>
                  <p>
                    <strong>Etage:</strong> {event.einzugsEtage}
                  </p>
                  <p>
                    <strong>Aufzug:</strong>{" "}
                    {event.einzugsAufzug || "ohne Aufzug"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="card text-bg-light mb-3 event-details">
            <div class="card-header text-center fw-bold">Umzugsliste</div>
            <div class="card-body">
              <p>{event.umzugsListe}</p>
            </div>
          </div>

          <p className="text-black event-details">
            <strong>Preis:</strong>{" "}
            {(() => {
              // prüfen, ob hvz nur eine Zahl ist
              const parts = String(event.preis).split(" ");
              const first = parts[0]; // z. B. "120"

              if (!isNaN(first)) {
                // erster Teil ist eine Zahl
                const rest = parts.slice(1).join(" "); // z. B. "for 2 hour"
                return rest ? `${first}€ ${rest}` : `${first}€`;
              }

              // falls kein Zahl am Anfang, einfach so anzeigen
              return event.preis;
            })()}
          </p>
          <p className="text-black event-details">
            <strong>HVZ:</strong> {event.hvz}€
          </p>
          <p className="text-black event-details">{event.bezahlMethod}</p>
          <p className="text-black event-details">
            <strong>Bemerkungen:</strong> {event.bemerkungen}
          </p>
        </div>
        <div className="d-flex flex-wrap justify-content-center gap-1 mt-3 ">
          <button
            onClick={() => navigate(`/auftraege/${id}/update`)}
            className="btn btn-success "
          >
            Update
          </button>
          <button
            style={{ marginLeft: "10px", color: "white" }}
            onClick={handleDelete}
            className="btn btn-danger "
          >
            Delete
          </button>
          <button
            style={{ marginLeft: "10px", color: "white" }}
            onClick={() => navigate(`/calendar`)}
            className="btn btn-secondary "
          >
            Züruck
          </button>
          <button
            style={{ marginLeft: "10px", color: "white" }}
            onClick={handleDownload}
            className="btn btn-secondary "
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuftragDetails;
