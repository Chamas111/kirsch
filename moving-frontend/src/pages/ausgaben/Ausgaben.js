import { useState, useEffect } from "react";
import axios from "../../axiosinstance";
import { useNavigate } from "react-router-dom";
import "./ausgaben.css";
function Ausgaben() {
  const navigate = useNavigate();
  const [ausgabe, setAusgabe] = useState({});
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
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/ausgaben`, {
        withCredentials: true,
      })
      .then((res) => {
        const sortedData = res.data.sort(
          (a, b) =>
            parseDate(formatDate(a.datum)) - parseDate(formatDate(b.datum))
        );

        // Group by month
        const grouped = {};
        sortedData.forEach((item) => {
          const [day, month, year] = formatDate(item.datum).split(".");
          const key = `${month}.${year}`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(item);
        });

        const monthKeys = Object.keys(grouped).sort((a, b) => {
          const [mA, yA] = a.split(".");
          const [mB, yB] = b.split(".");
          return new Date(`${yA}-${mA}-01`) - new Date(`${yB}-${mB}-01`);
        });

        setAusgabe(grouped);
        setMonths(monthKeys);
        setActiveMonth(monthKeys[0] || "");
      })
      .catch((err) => console.error("Error fetching ausgaben:", err));
  }, []);

  const AusgabeDelete = async (deleteId, monthKey) => {
    if (window.confirm("Are you sure you want to delete this Ausgabe?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/ausgaben/${deleteId}`,
          { withCredentials: true }
        );
        alert("Ausgabe deleted successfully!");
        setAusgabe((prev) => ({
          ...prev,
          [monthKey]: prev[monthKey].filter((item) => item._id !== deleteId),
        }));
      } catch (error) {
        console.error("Error deleting ausgabe:", error);
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
    setAusgabe((prev) => ({ ...prev, [newMonthKey]: [] }));
  };

  return (
    <div className="pt-4 mt-5">
      {ausgabe[activeMonth] && ausgabe[activeMonth].length > 0 && (
        <table className="table table-bordered table-success fw-bold mt-3 text-center">
          <thead>
            <tr>
              <th>Gesamt Betrag €</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {ausgabe[activeMonth]
                  .reduce((sum, r) => sum + parseFloat(r.betrag || 0), 0)
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
        <table className="table table-striped ">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Datum</th>
              <th>RechnungsNummer</th>
              <th>Anbieter</th>
              <th>Betrag</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {ausgabe[activeMonth] && ausgabe[activeMonth].length > 0 ? (
              ausgabe[activeMonth].map((item, index) => (
                <tr key={item._id}>
                  <td data-label="#">{index + 1}</td>
                  <td data-label="Datum">{formatDate(item.datum)}</td>
                  <td data-label="RechnungsNummer">{item.rechnungsNummer}</td>
                  <td data-label="Anbieter">{item.anbieter}</td>
                  <td data-label="Betrag">{item.betrag}€</td>
                  <td data-label="Update">
                    <button
                      className="btn btn-success"
                      onClick={() => navigate(`/ausgaben/${item._id}/update`)}
                    >
                      Update
                    </button>
                  </td>
                  <td data-label="Delete">
                    <button
                      className="btn btn-danger"
                      onClick={() => AusgabeDelete(item._id, activeMonth)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Keine Ausgabe-Daten für diesen Monat gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Add button */}
      <button
        type="button"
        className="btn btn-primary ausgabenbutton"
        onClick={() => navigate("/ausgaben/new")}
      >
        Add Ausgabe
      </button>
    </div>
  );
}

export default Ausgaben;
