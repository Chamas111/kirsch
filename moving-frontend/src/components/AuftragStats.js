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

function AuftragStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/auftraege/stats/yearly`,
          { withCredentials: true }
        );
        console.log("ggggg", res.data);
        setStats(res.data);
      } catch (err) {
        console.error("❌ Error fetching yearly stats:", err);
      }
    };

    fetchStats();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Aufträge pro Jahr</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={stats}
            dataKey="count"
            nameKey="year"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label
          >
            {stats.map((entry, index) => (
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

export default AuftragStats;
