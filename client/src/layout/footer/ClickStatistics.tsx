import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Skeleton } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ClickData {
  x: string;
  y: string;
}

interface APIResponse {
  clickStatistics: {
    datasets: [
      {
        data: ClickData[];
      }
    ];
  };
  os: { os: string; score: number }[];
  country: { countryName: string; score: number }[];
  city: { city: string; score: number; name: string; countryCode: string }[];
}

// API KEY
const LINK_STATISTICS_API_KEY = process.env.REACT_APP_LINK_STATISTICS_API;
const LINK_ID = process.env.REACT_APP_LINK_STATISTICS_LINKID;

const ClickStatistics: React.FC = () => {
  const [clickData, setClickData] = useState<ClickData[]>([]);
  const [osData, setOsData] = useState<{ os: string; score: number }[]>([]);
  const [countryData, setCountryData] = useState<
    { countryName: string; score: number }[]
  >([]);
  const [cityData, setCityData] = useState<
    { city: string; score: number; name: string; countryCode: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: "GET",
          url: `/statistics/link/${LINK_ID}?period=last30&tz=UTC`,
          headers: { accept: "*/*", Authorization: LINK_STATISTICS_API_KEY },
        };

        const response = await axios.request<APIResponse>(options);
        const clickData = response.data.clickStatistics.datasets[0].data;
        const osData = response.data.os;
        const countryData = response.data.country;
        const cityData = response.data.city;

        setClickData(clickData);
        setOsData(osData);
        setCountryData(countryData);
        setCityData(cityData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const labels = clickData.map((item) => new Date(item.x).toLocaleDateString());
  const dataPoints = clickData.map((item) => parseInt(item.y));

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Clicks Over Time",
        data: dataPoints,
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const osLabels = osData.map((os) => os.os);
  const osScores = osData.map((os) => os.score);

  const osChartData = {
    labels: osLabels,
    datasets: [
      {
        label: "Devices",
        data: osScores,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const countryLabels = countryData.map((country) => country.countryName);
  const countryScores = countryData.map((country) => country.score);

  const countryChartData = {
    labels: countryLabels,
    datasets: [
      {
        label: "Countries",
        data: countryScores,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const cityLabels = cityData.map((city) => city.name);
  const cityScores = cityData.map((city) => city.score);

  const cityChartData = {
    labels: cityLabels,
    datasets: [
      {
        label: "Cities",
        data: cityScores,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const downloadCsv = () => {
    const csvRows = [["Date", "Clicks"]];

    clickData.forEach((item) => {
      csvRows.push([new Date(item.x).toLocaleDateString(), item.y]);
    });

    csvRows.push(["", ""]);
    csvRows.push(["Device", "Score"]);
    osData.forEach((os) => {
      csvRows.push([os.os, os.score.toString()]);
    });

    csvRows.push(["", ""]);
    csvRows.push(["Country", "Score"]);
    countryData.forEach((country) => {
      csvRows.push([country.countryName, country.score.toString()]);
    });

    csvRows.push(["", ""]);
    csvRows.push(["City", "Score"]);
    cityData.forEach((city) => {
      csvRows.push([city.name, city.score.toString()]);
    });

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "click_statistics.csv");
    a.click();
  };

  // Replace loading message with Skeleton components
  if (loading) {
    return (
      <div className="container mx-auto p-4 bg-white">
        <h1 className="text-3xl font-bold mb-4 text-center">
          <Skeleton variant="text" width="60%" animation="wave" />
        </h1>

        <div className="mb-6 px-4 sm:px-8 lg:px-20">
          <Skeleton variant="rectangular" width="100%" height={400} animation="wave"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="rounded" width="100%" height={200} animation="wave"/>
          </div>
          <div className="flex flex-col items-center">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="rounded" width="100%" height={200} animation="wave"/>
          </div>
          <div className="flex flex-col items-center">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="rounded" width="100%" height={200} animation="wave"/>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Click Statistics</h1>

      {/* Line Chart for Clicks Over Time */}
      <div
        className="mb-6"
      >
        <Line data={chartData} options={{ responsive: true }} />
      </div>

      {/* Grid Layout for Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Pie Chart for Devices */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-center mb-4">
            Device Breakdown
          </h2>
          <div className="w-full max-w-sm">
            <Pie data={osChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Pie Chart for Countries */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-center mb-4">
            Country Breakdown
          </h2>
          <div className="w-full max-w-sm">
            <Pie
              data={countryChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Pie Chart for Cities */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-center mb-4">City Breakdown</h2>
          <div className="w-full max-w-sm">
            <Pie
              data={cityChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* CSV Download Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={downloadCsv}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default ClickStatistics;
