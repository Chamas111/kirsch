import { useState, useEffect } from "react";
import axios from "../../axiosinstance";
import { useNavigate } from "react-router-dom";
import "./hvz.css";
function Hvz() {
  const navigate = useNavigate();
  const [hvz, setHvz] = useState({}); // grouped by MM.YYYY
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
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/hvzs`, {
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

        setHvz(grouped);
        setMonths(monthKeys);
        setActiveMonth(monthKeys[0] || "");
      })
      .catch((err) => console.error("Error fetching event:", err));
  }, []);

  const HvzDelete = async (deleteId, monthKey) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/hvzs/${deleteId}`,
          { withCredentials: true }
        );
        alert("Event deleted successfully!");

        // Remove deleted item from grouped state
        setHvz((prev) => {
          const updatedMonth = prev[monthKey].filter(
            (item) => item._id !== deleteId
          );
          return { ...prev, [monthKey]: updatedMonth };
        });
      } catch (error) {
        console.error("Error deleting event:", error);
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

    setHvz((prev) => ({ ...prev, [newMonthKey]: [] }));
  };

  return (
    <>
      <div className="pt-1 hvzsize">
        {/* Tabs */}
        <div className="tabs mb-3 d-flex gap-2 pt-5 mt-5">
          {months.map((monthKey) => (
            <button
              key={monthKey}
              className={`btn btn-sm ${
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
            className="btn btn-md btn-success ms-auto"
            onClick={addNewMonth}
          >
            + Monat hinzufügen
          </button>
        </div>
        <div className="table-responsive ">
          {/* Table for active month */}
          <table className="table table-striped">
            <thead className="table-dark text-center ">
              <tr>
                <th>#</th>
                <th>Datum</th>
                <th>Classification</th>
                <th>Adresse</th>
                <th>Kunde</th>
                <th>Status</th>
                <th>Nennen</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody className=" text-center ">
              {hvz[activeMonth] && hvz[activeMonth].length > 0 ? (
                hvz[activeMonth].map((item, index) => (
                  <tr key={item._id}>
                    <th data-label="#">{index + 1}</th>
                    <td data-label="Datum">{item.datum}</td>
                    <td
                      data-label="Classification"
                      style={{
                        backgroundColor:
                          item.classification === "Privat"
                            ? "green"
                            : item.classification === "Rechnung"
                            ? "red"
                            : "transparent",
                        color: "white",
                      }}
                    >
                      {item.classification}
                    </td>
                    <td data-label="Adresse">{item.straße}</td>
                    <td data-label="Kunde">{item.kundeName}</td>
                    <td
                      data-label="Status"
                      style={{
                        backgroundColor:
                          item.status === "Bestellt"
                            ? "green"
                            : item.status === "Nicht bestellt"
                            ? "gray"
                            : item.status === "Genehmigt"
                            ? "purple"
                            : item.status === "Abgelehnt"
                            ? "red"
                            : "transparent",
                        color: "white",
                      }}
                    >
                      {item.status}
                    </td>
                    <td data-label="Nennen">{`HVZ_${item.datum}_${item.straße}_${item.kundeName}`}</td>
                    <td data-label="Update">
                      <button
                        className="btn btn-success"
                        onClick={() => navigate(`/hvz/${item._id}/update`)}
                      >
                        Update
                      </button>
                    </td>
                    <td data-label="Delete">
                      <button
                        className="btn btn-danger"
                        onClick={() => HvzDelete(item._id, activeMonth)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    Keine HVZ-Daten für diesen Monat gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Add new HVZ button */}

        <button
          type="button"
          className="btn btn-primary hvzbutton"
          onClick={() => navigate("/hvz/new")}
        >
          Add HVZ
        </button>
      </div>
    </>
  );
}

export default Hvz;
