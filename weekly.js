const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function createChart(id, type, label, data, color) {
  new Chart(document.getElementById(id), {
    type: type,
    data: {
      labels: weekLabels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 2,
        fill: type === "line" ? false : true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "white" } } },
      scales: {
        x: { ticks: { color: "white" } },
        y: { ticks: { color: "white" } }
      }
    }
  });
}

createChart("phChart", "line", "pH Level", [7.1, 7.3, 7.0, 7.2, 7.4, 7.1, 7.2], "#ff6384");
createChart("turbidityChart", "bar", "Turbidity (NTU)", [1.5, 1.8, 1.3, 1.6, 1.4, 1.9, 1.7], "#36a2eb");
createChart("tempChart", "line", "Temperature °C", [24, 25, 23, 26, 24, 25, 24], "#ff9f40");
createChart("oxygenChart", "bar", "Dissolved Oxygen (mg/L)", [8.1, 8.3, 8.0, 8.4, 8.2, 8.1, 8.3], "#4bc0c0");
createChart("conductivityChart", "radar", "Conductivity", [200, 210, 205, 220, 215, 210, 208], "#9966ff");
createChart("salinityChart", "polarArea", "Salinity (ppt)", [30, 32, 31, 33, 30, 32, 31], ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff", "#c9cbcf", "#00eaff"]);
createChart("nitrateChart", "doughnut", "Nitrate (mg/L)", [3, 2.5, 3.2, 2.8, 3.1, 2.9, 3.0], ["#ff9f40", "#4bc0c0", "#9966ff", "#ff6384", "#36a2eb", "#ffcd56", "#00eaff"]);
createChart("usageChart", "line", "Water Usage (L)", [1200, 1300, 1250, 1400, 1350, 1280, 1320], "#00eaff");
