import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Auftraege() {
  const [Auftraege, setAuftraege] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/auftraege`, {
        withCredentials: true,
      })

      .then((res) => setAuftraege(res.data))
      .catch((e) => console.log(e));
  }, []);

  return (
    <div>
      {Auftraege.map((auftrag) => (
        <p key={auftrag._id}>
          <Link to={`/auftraege/${auftrag._id}`}>{auftrag.title}</Link>
        </p>
      ))}
    </div>
  );
}

export default Auftraege;
