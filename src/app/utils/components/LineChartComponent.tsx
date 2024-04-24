import React from "react";
import Chart, { type ChartWrapperOptions } from "react-google-charts";
import { type WindData } from "../types";

export default function LineChartComponent({
  windData,
}: {
  windData: WindData | null;
}) {
  const options: ChartWrapperOptions["options"] = {
    title: "",
    curveType: "function",
    series: [{ color: "#ff0000" }],
    intervals: { style: "area" },
    legend: "none",
    focusTarget: "category",
    hAxis: {
      slantedText: true,
      slantedTextAngle: 45,
      format: "HH:mm",
    },
    vAxis: {
      format: "# kn",
      minValue: 0,
      viewWindow: {
        min: 0,
        max:
          windData !== null
            ? Math.max(
                15,
                windData.wind_histogram.reduce((max, current) => {
                  return Number(current.max_gust.value) > max
                    ? Number(current.max_gust.value)
                    : max;
                }, 15) + 1,
              )
            : 15,
      },
    },
    tooltip: {
      isHtml: true,
    },
    chartArea: {
      width: "100%",
      left: 50,
      right: 10,
    },
  };

  if (!windData) return null;

  const data = [
    [
      { type: "date", label: "Tid" },
      /* { type: "number", label: "Snitt vind" }, */
      { type: "number", label: "Vindkast" },
      { id: "i0", type: "number", role: "interval" },
      { id: "i1", type: "number", role: "interval" },
      { type: "string", role: "tooltip", p: { html: true } }, // Tooltip column
    ],
    ...windData.wind_histogram.map((wei) => {
      return [
        new Date(wei.timestamp),
        /* wei.avg_wind, */
        wei.max_gust.value,
        wei.avg_wind,
        wei.max_gust.value,
        `<div style="width:180px;padding:5px;color:black;"><strong>Tid:</strong> ${new Date(wei.timestamp).toLocaleTimeString()}<br/><strong>Snittvind:</strong> ${Number(wei.avg_wind).toFixed(1)} kn<br/><strong>Vindkast:</strong> ${wei.max_gust.value} kn</div>`,
      ];
    }),
  ];

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}