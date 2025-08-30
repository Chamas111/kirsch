import React from "react";
import "./home.css";
import AuftragStats from "../../components/AuftragStats";
import AuftragStatsMonthly from "../../components/AuftragStatsMonthly";
import CalendarPage from "../../components/CalendarPage";
import FinanzChart from "../../components/FinanzChart";
import FinanzYearlyPieChart from "../../components/FinanzYearlyPieChart";
function Home() {
  return (
    <div className="stats-container pt-5 mt-5">
      {/* Yearly Pie */}
      <div className="stats-card">
        <AuftragStats />
      </div>
      <div className="stats-card">
        <FinanzYearlyPieChart />
      </div>
      <div className="stats-card">
        <FinanzChart />
      </div>
      {/* Monthly Pie */}
      <div className="stats-card">
        <AuftragStatsMonthly year={2025} />
      </div>

      {/* Full width FinanzChart */}
    </div>
  );
}

export default Home;
