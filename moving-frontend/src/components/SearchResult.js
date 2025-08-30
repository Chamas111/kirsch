import { useState, useEffect } from "react";
import axios from "../axiosinstance";
import { useLocation, useNavigate } from "react-router-dom";
import "./searchResult.css";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const formatDate = (dateStr) => {
  if (!dateStr) return "";

  // Try ISO first
  let d = new Date(dateStr);
  if (!isNaN(d)) {
    return d.toLocaleDateString("de-DE");
  }

  // Handle format like DD.MM.YYYY
  const parts = dateStr.split(".");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(d)) {
      return d.toLocaleDateString("de-DE");
    }
  }

  return dateStr; // fallback: just return original string
};

function SearchResults() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const queryParams = useQuery();
  const navigate = useNavigate();
  const query = queryParams.get("query") || "";
  const [results, setResults] = useState({
    auftraege: [],
    invoices: [],
    ausgaben: [],
    hvzs: [],
    lagerungen: [],
  });

  useEffect(() => {
    if (!query) return;
    axios
      .get(`/api/search?query=${encodeURIComponent(query)}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.error("❌ Fehler bei Suche:", err));
  }, [query]);

  // Cleanup: Clear external search input
  useEffect(() => {
    return () => {
      if (typeof window.clearSearchInput === "function") {
        window.clearSearchInput();
      }
    };
  }, []);

  // Handle X button from external input
  useEffect(() => {
    const handleClear = () => {
      navigate(-1);
    };

    if (typeof window.onSearchClear === "function") {
      window.onSearchClear(handleClear);
    }
  }, [navigate]);

  // === RENDER HELPERS ===

  function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }, [matches, query]);

    return matches;
  }
  // Table (Desktop)
  const renderTable = (data, columns) => {
    if (data.length === 0) return <p>No results found</p>;
    return (
      <table className="table table-striped">
        <thead className="table-dark text-center">
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((item, idx) => (
            <tr key={item._id || idx}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.format
                    ? col.format(item, idx) // pass item + index
                    : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Cards (Mobile)
  const renderCards = (data, columns) => {
    if (data.length === 0) return <p>No results found</p>;
    return (
      <div className="card-list">
        {data.map((item, idx) => (
          <div className="result-card" key={item._id || idx}>
            {columns.map((col) => (
              <div className="card-row" key={col.key}>
                <strong>{col.label}:</strong>{" "}
                {col.format ? col.format(item, idx) : item[col.key]}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // === COLUMNS CONFIG ===
  const columnsConfig = {
    auftraege: [
      { key: "idx", label: "#", format: (_, idx) => idx + 1 },
      { key: "title", label: "Title" },
      {
        key: "datum",
        label: "Datum",
        format: (item) => formatDate(item.start),
      },
      {
        key: "uhrZeit",
        label: "UhrZeit",
        format: (item) => {
          if (!item.start) return "";
          const date = new Date(item.start);
          return date.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
      { key: "kundeName", label: "Kunde" },
      { key: "tel", label: "Telefon" },
    ],
    invoices: [
      { key: "idx", label: "#", format: (_, idx) => idx + 1 },
      { key: "rechnungsNummer", label: "Rechnungsnummer" },
      { key: "status", label: "Status" },
      { key: "kundeName", label: "Kunde" },
      { key: "nettoBetrag", label: "Netto €" },
      { key: "mwst", label: "MwSt €" },
      { key: "brutto", label: "Brutto €" },
      {
        key: "rechnungsDatum",
        label: "Datum",
        format: (item) => formatDate(item.rechnungsDatum),
      },
    ],
    ausgaben: [
      { key: "idx", label: "#", format: (_, idx) => idx + 1 },
      {
        key: "datum",
        label: "Datum",
        format: (item) => formatDate(item.datum),
      },
      { key: "rechnungsNummer", label: "RechnungsNummer" },
      { key: "anbieter", label: "Anbieter" },
      { key: "betrag", label: "Betrag" },
    ],
    hvzs: [
      { key: "idx", label: "#", format: (_, idx) => idx + 1 },
      {
        key: "datum",
        label: "Datum",
        format: (item) => formatDate(item.datum),
      },
      { key: "classification", label: "Classification" },
      { key: "straße", label: "Adresse" },
      { key: "kundeName", label: "Kunde" },
      { key: "status", label: "Status" },
    ],
    lagerungen: [
      { key: "idx", label: "#", format: (_, idx) => idx + 1 },
      {
        key: "datum",
        label: "Datum",
        format: (item) => formatDate(item.datum),
      },
      { key: "kundeName", label: "Kunde" },
      { key: "lager", label: "Lager Place" },
      { key: "employeeName", label: "Mitarbeiter" },
      { key: "notitz", label: "Notitz" },
    ],
  };

  return (
    <div className="search-results pt-5 mt-5">
      <h2>Search Results for "{query}"</h2>

      {Object.entries(results).map(([key, data]) =>
        data?.length > 0 ? (
          <section key={key}>
            <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>

            {/* Nur EINE Ansicht anzeigen */}
            {
              isMobile
                ? renderCards(data, columnsConfig[key]) // Mobile = Karten
                : renderTable(data, columnsConfig[key]) // Desktop = Tabellen
            }
          </section>
        ) : null
      )}
    </div>
  );
}

export default SearchResults;
