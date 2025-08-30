import { useEffect, useState } from "react";
import axios from "../axiosinstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function FinanzPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const finanzStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/statistics/monatsstatistik`,
          { withCredentials: true }
        );

        const mapped = res.data.map((d) => ({
          month: d.month,
          ausgaben: Number(d.ausgaben) || 0,
          eingaben: Number(d.eingaben) || 0,
        }));

        // Optional: sort by monthIndex if available
        mapped.sort((a, b) => (a.monthIndex || 0) - (b.monthIndex || 0));

        setData(mapped);
      } catch (err) {
        console.error("❌ Error fetching monthly stats:", err);
      }
    };

    finanzStats();
  }, []);

  // Prepare data for PieChart: one slice for Ausgaben and one for Eingaben per month
  const pieData = [
    {
      name: "Ausgaben",
      value: data.reduce((sum, d) => sum + Number(d.ausgaben || 0), 0),
    },
    {
      name: "Eingaben",
      value: data.reduce((sum, d) => sum + Number(d.eingaben || 0), 0),
    },
  ];

  const COLORS = ["#ff6b6b", "#82ca9d"]; // Red = Ausgaben, Green = Eingaben
  console.log("Piedata", pieData);
  return (
    <div className="w-full h-[400px] p-4">
      <h3 className="text-xl font-bold mb-4">
        📊 Ausgaben vs Eingaben (Monatlich)
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
            label={({ value }) => `${value} €`} // adds € to label
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} €`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FinanzPieChart;
