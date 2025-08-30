import { useEffect, useState } from "react";
import axios from "../axiosinstance";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AuftragStatsMonthlyPie({ year }) {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/auftraege/stats/monthly/${year}`,
          { withCredentials: true }
        );
        setStats(res.data);
      } catch (err) {
        console.error("❌ Error fetching monthly stats:", err);
      }
    };

    fetchStats();
  }, [year]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ];
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF6699",
    "#33CCFF",
    "#99FF33",
    "#CC99FF",
    "#FF9933",
    "#66CCFF",
    "#FF3333",
  ];

  const data = stats.map((s) => ({
    month: monthNames[s.month - 1],
    count: s.count,
  }));

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Aufträge pro Monat ({year})</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="month"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            formatter={(value) => (
              <span style={{ color: "white" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AuftragStatsMonthlyPie;
