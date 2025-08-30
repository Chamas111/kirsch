import { useState, useEffect } from "react";
import axios from "../../axiosinstance";
import { useNavigate } from "react-router-dom";
import "./rechnungen.css";
function Rechnungen() {
  const navigate = useNavigate();
  const [rechnungen, setRechnungen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState([]);
  const [activeMonth, setActiveMonth] = useState("");

  // Convert ISO string to "dd.mm.yyyy"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("de-DE");
  };

  // Parse "dd.mm.yyyy" => Date
  const parseDate = (str) => {
    if (!str) return new Date(0);
    const [day, month, year] = str.split(".");
    return new Date(`${year}-${month}-${day}`);
  };

  // Month key => display text
  const monthNameFromKey = (key) => {
    const monthsMap = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mär",
      "04": "Apr",
      "05": "Mai",
      "06": "Jun",
      "07": "Jul",
      "08": "Aug",
      "09": "Sep",
      10: "Okt",
      11: "Nov",
      12: "Dez",
    };

    const [m, y] = key.split(".");
    const monthKey = m.padStart(2, "0"); // always '01' to '12'
    return `${monthsMap[monthKey]} ${y}`;
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/invoices`, {
        withCredentials: true,
      })
      .then((res) => {
        // Use rechnungsDatum instead of datum
        const sortedData = res.data.sort(
          (a, b) => new Date(a.rechnungsDatum) - new Date(b.rechnungsDatum)
        );

        // Group by month
        const grouped = {};
        sortedData.forEach((item) => {
          const d = new Date(item.rechnungsDatum);
          const month = String(d.getMonth() + 1).padStart(2, "0"); // 01..12
          const year = d.getFullYear();
          const key = `${month}.${year}`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(item);
        });

        const monthKeys = Object.keys(grouped).sort((a, b) => {
          const [mA, yA] = a.split(".");
          const [mB, yB] = b.split(".");
          return new Date(`${yA}-${mA}-01`) - new Date(`${yB}-${mB}-01`);
        });

        setRechnungen(grouped);
        setMonths(monthKeys);
        setActiveMonth(monthKeys[0] || "");
      })
      .catch((err) => console.error("Error fetching Rechnungen:", err));
  }, []);

  const allInvoices = Object.values(rechnungen).flat();

  const monthlyTotals = allInvoices.reduce((acc, item) => {
    // Extract month and year
    const date = new Date(item.rechnungsDatum);
    const month = date.getMonth() + 1; // 0-indexed
    const year = date.getFullYear();
    const key = `${year}-${month.toString().padStart(2, "0")}`;

    if (!acc[key]) {
      acc[key] = {
        totalNetto: 0,
        totalMwst: 0,
        totalBrutto: 0,
        month: key,
      };
    }

    acc[key].totalNetto += parseFloat(item.nettoBetrag) || 0;
    acc[key].totalMwst += parseFloat(item.mwst) || 0;
    acc[key].totalBrutto += parseFloat(item.brutto) || 0;

    return acc;
  }, {});

  const getFaelligStatus = (item) => {
    const status = item.status?.trim();
    const faellig = item.faellig?.trim();

    // 1) Manual override
    if (faellig === "Erinnerung gesendet") {
      return "Erinnerung gesendet";
    }

    // 2) Cash or Bezahlt
    if (status === "Cash" || status === "Bezahlt") {
      return "-";
    }

    // 3) Überweisung & check overdue
    if (status === "Überweisung") {
      const rechnungsDate = new Date(item.rechnungsDatum);
      const now = new Date();

      const diffDays = Math.floor(
        (now - rechnungsDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays >= 15) {
        return "Erinnerung";
      }
    }

    // 4) Default → show stored value
    return faellig || "";
  };

  // Convert object to array to map in JSX
  const monthlyTotalsArray = Object.values(monthlyTotals);

  const RechnungDelete = async (deleteId, monthKey) => {
    if (window.confirm("Are you sure you want to delete this Rechnung?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/invoices/${deleteId}`,
          { withCredentials: true }
        );
        alert("Rechnung deleted successfully!");
        setRechnungen((prev) => ({
          ...prev,
          [monthKey]: prev[monthKey].filter((item) => item._id !== deleteId),
        }));
      } catch (error) {
        console.error("Error deleting Rechnung:", error);
      }
    }
  };

  const addNewMonth = () => {
    const userInput = prompt(
      "Enter new month (German abbreviations, e.g. Aug 2025):"
    );
    if (!userInput) return;

    const [monthName, year] = userInput.trim().split(" ");
    const monthsMap = {
      Jan: "01",
      Feb: "02",
      Mär: "03",
      Apr: "04",
      Mai: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Okt: "10",
      Nov: "11",
      Dez: "12",
    };

    const monthNumber = monthsMap[monthName];
    if (!monthNumber || !year) {
      alert("Invalid format. Use e.g. 'Aug 2025'");
      return;
    }

    const newMonthKey = `${monthNumber}.${year}`;
    if (months.includes(newMonthKey)) {
      setActiveMonth(newMonthKey);
      return;
    }

    const newMonths = [...months, newMonthKey].sort((a, b) => {
      const [mA, yA] = a.split(".");
      const [mB, yB] = b.split(".");
      return new Date(`${yA}-${mA}-01`) - new Date(`${yB}-${mB}-01`);
    });

    setMonths(newMonths);
    setActiveMonth(newMonthKey);
    setRechnungen((prev) => ({ ...prev, [newMonthKey]: [] }));
  };

  return (
    <div className="pt-4 mt-5">
      {rechnungen[activeMonth] && rechnungen[activeMonth].length > 0 && (
        <table className="table table-bordered table-success fw-bold mt-3 text-center">
          <thead>
            <tr>
              <th>Gesamt Netto €</th>
              <th>Gesamt MwSt €</th>
              <th>Gesamt Brutto €</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {rechnungen[activeMonth]
                  .reduce((sum, r) => sum + parseFloat(r.nettoBetrag || 0), 0)
                  .toFixed(2)}{" "}
                €
              </td>
              <td>
                {rechnungen[activeMonth]
                  .reduce((sum, r) => sum + parseFloat(r.mwst || 0), 0)
                  .toFixed(2)}{" "}
                €
              </td>
              <td>
                {rechnungen[activeMonth]
                  .reduce((sum, r) => sum + parseFloat(r.brutto || 0), 0)
                  .toFixed(2)}{" "}
                €
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {/* Tabs */}
      <div className="tabs mb-3 d-flex gap-2">
        {months.map((monthKey) => (
          <button
            key={monthKey}
            className={`btn btn-md ${
              activeMonth === monthKey
                ? "btn-secondary "
                : "btn-outline-secondary text-black  "
            }`}
            onClick={() => setActiveMonth(monthKey)}
          >
            {monthNameFromKey(monthKey)}
          </button>
        ))}
        <button
          className="btn btn-sm btn-success ms-auto"
          onClick={addNewMonth}
        >
          + Monat hinzufügen
        </button>
      </div>
      <div className="table-responsive">
        {/* Table */}
        <table className="table table-striped">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Rechnungsnummer</th>
              <th>Status</th>
              <th>Kunde</th>
              <th>Netto €</th>
              <th>MwSt €</th>
              <th>Brutto €</th>
              <th>Rechnungsdatum</th>
              <th>Fällig</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {rechnungen[activeMonth] && rechnungen[activeMonth].length > 0 ? (
              <>
                {rechnungen[activeMonth].map((item, index) => (
                  <tr key={item._id}>
                    <td data-label="#">{index + 1}</td>
                    <td data-label="RechnungsNummer">{item.rechnungsNummer}</td>
                    <td
                      data-label="Status"
                      style={{
                        backgroundColor:
                          item.status?.trim() === "Überweisung"
                            ? "red"
                            : item.status?.trim() === "Bezahlt" ||
                              item.status?.trim() === "Cash" ||
                              item.status?.trim() === "Storniert"
                            ? "green"
                            : "transparent",
                        color: "white",
                      }}
                    >
                      {item.status}
                    </td>
                    <td data-label="kundeName">{item.kundeName}</td>
                    <td data-label="NettoBetrag">{item.nettoBetrag} €</td>
                    <td data-label="Mwst">{item.mwst} €</td>
                    <td data-label="Brutto">{item.brutto} €</td>
                    <td data-label="RechnungsDatum">
                      {formatDate(item.rechnungsDatum)}
                    </td>
                    <td
                      data-label="Fällig"
                      style={{
                        backgroundColor:
                          getFaelligStatus(item) === "Erinnerung"
                            ? "red"
                            : getFaelligStatus(item) === "Erinnerung gesendet"
                            ? "green"
                            : "transparent",
                        color:
                          getFaelligStatus(item) === "Erinnerung" ||
                          getFaelligStatus(item) === "Erinnerung gesendet"
                            ? "white"
                            : "black",
                      }}
                    >
                      {getFaelligStatus(item)}
                    </td>
                    <td data-label="Update">
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          navigate(`/rechnungen/${item._id}/update`)
                        }
                      >
                        Update
                      </button>
                    </td>
                    <td data-label="Delete">
                      <button
                        className="btn btn-danger"
                        onClick={() => RechnungDelete(item._id, activeMonth)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  Keine Rechnung-Daten für diesen Monat gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Add button */}
      <button
        type="button"
        className="btn btn-primary rechnungsbutton"
        onClick={() => navigate("/rechnungen/new")}
      >
        Add Rechnung
      </button>
    </div>
  );
}

export default Rechnungen;
