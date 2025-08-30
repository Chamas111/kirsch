import { useState, useEffect } from "react";
import axios from "../../axiosinstance";
import { useNavigate } from "react-router-dom";
import "./lagerung.css";
function Lagerung() {
  const navigate = useNavigate();
  const [lager, setLager] = useState({}); // grouped by MM.YYYY
  const [months, setMonths] = useState([]); // array of month keys like "08.2025"
  const [activeMonth, setActiveMonth] = useState("");

  // Helper to parse "dd.mm.yyyy" => Date obj
  const parseDate = (str) => {
    if (!str) return new Date(0);
    const [day, month, year] = str.split(".");
    return new Date(`${year}-${month}-${day}`);
  };

  // Helper: Convert MM.YYYY => "Aug 2025"
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
    return `${monthsMap[m]} ${y}`;
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/lagerungs`, {
        withCredentials: true,
      })
      .then((res) => {
        // Sort all data ascending by datum
        const sortedData = res.data.sort(
          (a, b) => parseDate(a.datum) - parseDate(b.datum)
        );

        // Group by month key MM.YYYY
        const grouped = {};
        sortedData.forEach((item) => {
          if (!item.datum) return;
          const [, month, year] = item.datum.split(".");
          const key = `${month}.${year}`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(item);
        });

        const monthKeys = Object.keys(grouped);

        // Sort month keys ascending
        monthKeys.sort((a, b) => {
          const [mA, yA] = a.split(".");
          const [mB, yB] = b.split(".");
          return new Date(`${yA}-${mA}-01`) - new Date(`${yB}-${mB}-01`);
        });

        setLager(grouped);
        setMonths(monthKeys);
        setActiveMonth(monthKeys[0] || "");
      })
      .catch((err) => console.error("Error fetching event:", err));
  }, []);

  const LagerDelete = async (deleteId, monthKey) => {
    if (window.confirm("Are you sure you want to delete this Lager?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/lagerungs/${deleteId}`,
          { withCredentials: true }
        );
        alert("Event deleted successfully!");

        // Remove deleted item from grouped state
        setLager((prev) => {
          const updatedMonth = prev[monthKey].filter(
            (item) => item._id !== deleteId
          );
          return { ...prev, [monthKey]: updatedMonth };
        });
      } catch (error) {
        console.error("Error deleting lager:", error);
      }
    }
  };

  const addNewMonth = () => {
    const userInput = prompt(
      "Enter new month (German abbreviations, e.g. Aug 2025):"
    );
    if (!userInput) return;

    const [monthName, year] = userInput.trim().split(" ");
    if (!monthName || !year) {
      alert("Invalid format. Please enter month and year like 'Aug 2025'");
      return;
    }

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
    if (!monthNumber) {
      alert("Invalid month name. Use German abbreviations like 'Aug'");
      return;
    }

    const newMonthKey = `${monthNumber}.${year}`;

    if (months.includes(newMonthKey)) {
      alert("Month already exists!");
      setActiveMonth(newMonthKey);
      return;
    }

    const newMonths = [...months, newMonthKey];

    newMonths.sort((a, b) => {
      const [mA, yA] = a.split(".");
      const [mB, yB] = b.split(".");
      return new Date(`${yA}-${mA}-01`) - new Date(`${yB}-${mB}-01`);
    });

    setMonths(newMonths);
    setActiveMonth(newMonthKey);

    setLager((prev) => ({ ...prev, [newMonthKey]: [] }));
  };

  return (
    <div className="pt-5 mt-5">
      {/* Tabs */}
      <div className="tabs d-flex gap-2">
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
        {/* Table for active month */}
        <table className="table table-striped pt-1 mt-2">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Datum</th>
              <th>kunde</th>
              <th>Lager Place</th>
              <th>Mitarbeiter</th>
              <th>Notitz</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {lager[activeMonth] && lager[activeMonth].length > 0 ? (
              lager[activeMonth].map((item, index) => (
                <tr key={item._id}>
                  <th data-label="#">{index + 1}</th>
                  <td data-label="datum">{item.datum}</td>
                  <td data-label="kundeName">{item.kundeName}</td>
                  <td data-label="lager">{item.lager}</td>
                  <td data-label="employeeName">{item.employeeName}</td>
                  <td data-label="notitz">{item.notitz}</td>

                  <td data-label="Update">
                    <button
                      className="btn btn-success"
                      onClick={() => navigate(`/lagerung/${item._id}/update`)}
                    >
                      Update
                    </button>
                  </td>
                  <td data-label="Delete">
                    <button
                      className="btn btn-danger"
                      onClick={() => LagerDelete(item._id, activeMonth)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  Keine Lager-Daten für diesen Monat gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Add new HVZ button */}
      <button
        type="button"
        className="btn btn-primary mt-2 mb-2"
        onClick={() => navigate("/lagerung/new")}
      >
        Add Lager
      </button>
    </div>
  );
}

export default Lagerung;
