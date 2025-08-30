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

function FinanzYearlyPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchYearlyStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/statistics/jahresstatistik`,
          { withCredentials: true }
        );

        const mapped = res.data.map((d) => ({
          year: d.year,
          ausgaben: Number(d.ausgaben) || 0,
          eingaben: Number(d.eingaben) || 0,
        }));
        console.log("yearly", mapped);
        setData(mapped);
      } catch (err) {
        console.error("❌ Error fetching yearly stats:", err);
      }
    };

    fetchYearlyStats();
  }, []);

  // Flatten data: each year has two slices (Ausgaben and Eingaben)
  const pieData = data.flatMap((d) => [
    { name: `${d.year} - Ausgaben`, value: d.ausgaben },
    { name: `${d.year} - Eingaben`, value: d.eingaben },
  ]);

  const COLORS = [
    "#ff6b6b",
    "#82ca9d",
    "#ff9f43",
    "#4dabf7",
    "#f06595",
    "#ffd43b",
  ];
  console.log("piedata", pieData);
  return (
    <div className="w-full h-[400px] p-4 ">
      <h3 className="text-xl font-bold mb-4 ">
        📊 Ausgaben vs Eingaben (Jahrlich)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label={({ value }) => `${value.toLocaleString("de-DE")} €`}
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value.toLocaleString("de-DE")} €`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FinanzYearlyPieChart;
