// homenew.js - Corrected Version
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

/* ---------- Firebase config ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyAJAe9QShFklhwMrY9YN8EjLhffMFL0D0U",
  authDomain: "smartwatermanagement-35fab.firebaseapp.com",
  databaseURL: "https://smartwatermanagement-35fab-default-rtdb.firebaseio.com",
  projectId: "smartwatermanagement-35fab",
  storageBucket: "smartwatermanagement-35fab.firebasestorage.app",
  messagingSenderId: "266724701978",
  appId: "1:266724701978:web:75f65a280f7abd07045ea3"
};
/* ---------------------------------------------------------------- */

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

/* ------------------ Intro typing + move ------------------ */
const introText = document.getElementById("introText");
const homeDashboard = document.getElementById("homeDashboard");
let text = "HOME";
let index = 0;

function typeWriter() {
  if (index < text.length) {
    introText.textContent += text.charAt(index);
    index++;
    setTimeout(typeWriter, 180);
  } else {
    setTimeout(moveToTop, 300);
  }
}

function moveToTop() {
  introText.classList.add("moveToTopLeft");
  setTimeout(() => {
    document.getElementById("introWrapper").style.display = "none";
    homeDashboard.style.display = "block";
    createCharts();
    startRealtime();
    animateLeak();
  }, 800);
}

window.onload = typeWriter;

/* ------------------ Chart creation ------------------ */
const chartMap = {};
const MAX_POINTS = 12;

function createCharts() {
  function makeChart(ctx, cfg) {
    const c = new Chart(ctx, cfg);
    chartMap[ctx.id] = c;
    return c;
  }

  // tankCapacity
  makeChart(document.getElementById('tankCapacityChart'), {
    type: 'doughnut',
    data: { labels: ['Filled','Empty'], datasets: [{ data: [0,100], backgroundColor: ['#00f260','#ccc'] }] },
    options: { cutout: '80%', plugins:{legend:{display:false}} }
  });

  // temperature
  makeChart(document.getElementById('temperatureChart'), {
    type: 'bar',
    data: { labels:['Temp (°C)'], datasets:[{ data:[0], backgroundColor:'#ff6f61' }] },
    options: { indexAxis: 'y', plugins:{legend:{display:false}}, scales:{x:{beginAtZero:true}} }
  });

  // ph
  makeChart(document.getElementById('phChart'), {
    type: 'bar',
    data: { labels:['pH'], datasets:[{ data:[0], backgroundColor:'#4dd0e1' }] },
    options: { indexAxis: 'y', plugins:{legend:{display:false}}, scales:{x:{beginAtZero:true}} }
  });

  // tds
  makeChart(document.getElementById('tdsChart'), {
    type: 'line',
    data: { labels:[], datasets:[{ label:'TDS', data:[], borderColor:'#ff9800', fill:false }] },
    options:{ responsive:true, plugins:{legend:{display:false}} }
  });

  // turbidity
  makeChart(document.getElementById('turbidityChart'), {
    type: 'bubble',
    data: { datasets:[ { label:'Turbidity', data:[{x:1,y:0,r:5}], backgroundColor:'#ab47bc' } ] },
    options:{ plugins:{legend:{display:false}}, scales:{x:{display:false}} }
  });

  // chlorine
  makeChart(document.getElementById('chlorineChart'), {
    type: 'doughnut',
    data: { labels:['Chlorine','Other'], datasets:[{ data:[0,100], backgroundColor:['#03a9f4','#eee'] }] },
    options:{ cutout:'70%', plugins:{legend:{display:false}} }
  });

  // inflow
  makeChart(document.getElementById('inflowChart'), {
    type: 'line',
    data: { labels:[], datasets:[{ label:'Inflow', data:[], fill:true, backgroundColor:'rgba(0,242,96,0.2)', borderColor:'#00f260' }] },
    options:{ plugins:{legend:{display:false}} }
  });

  // outflow
  makeChart(document.getElementById('outflowChart'), {
    type: 'line',
    data: { labels:[], datasets:[{ label:'Outflow', data:[], fill:true, backgroundColor:'rgba(255,99,132,0.2)', borderColor:'#ff6384' }] },
    options:{ plugins:{legend:{display:false}} }
  });

  // usage
  makeChart(document.getElementById('usageChart'), {
    type: 'doughnut',
    data: { labels:['Used','Remaining'], datasets:[{ data:[0,100], backgroundColor:['#ffeb3b','#555'] }] },
    options:{ cutout:'75%', plugins:{legend:{display:false}} }
  });
}

/* ------------------ Start realtime listener ------------------ */
function startRealtime() {
  const rootRef = ref(db, 'WaterData');
  
  onValue(rootRef, snapshot => {
    const raw = snapshot.val();
    if (!raw) {
      console.log("No data available at the 'WaterData' location");
      return;
    }
    
    console.log("Firebase data received:", raw);

    // Normalize data with proper fallbacks
    const data = {
      temperature: parseFloat(raw.temperature || raw.Temperature || 0),
      ph: parseFloat(raw.pH || raw.ph || raw.PH || 0),
      tds: parseFloat(raw.tds || raw.TDS || 0),
      turbidity: parseFloat(raw.turbidity || 0),
      chlorine: parseFloat(raw.chlorine || 0),
      inflow: parseFloat(raw.inflow || 0),
      outflow: parseFloat(raw.outflow || 0),
      usage: parseFloat(raw.usage || 0),
      tankCapacity: parseFloat(raw.tankCapacity || raw.tankcapacity || raw.capacity || 0),
      leak: raw.leak || raw.Leak || false
    };

    console.log("Normalized data:", data);
    updateAllCharts(data);
    
  }, err => {
    console.error("Firebase read error:", err);
  });
}

/* ------------------ Update logic ------------------ */
function pushTimeLabel(chart) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  chart.data.labels.push(timeStr);
  if (chart.data.labels.length > MAX_POINTS) {
    chart.data.labels.shift();
    chart.data.datasets.forEach(ds => ds.data.shift());
  }
}

function updateAllCharts(data) {
  console.log("Updating charts with:", data);
  
  // Helper function to safely update chart data
  function updateChart(chartId, updater) {
    const chart = chartMap[chartId];
    if (!chart) {
      console.warn(`Chart ${chartId} not found!`);
      return;
    }
    updater(chart);
    chart.update();
    console.log(`Updated ${chartId}`, chart.data);
  }

  // tankCapacity (doughnut)
  updateChart('tankCapacityChart', (chart) => {
    const v = Math.max(0, Math.min(100, data.tankCapacity || 0));
    chart.data.datasets[0].data = [v, 100 - v];
  });

  // temperature (bar)
  updateChart('temperatureChart', (chart) => {
    chart.data.datasets[0].data = [data.temperature || 0];
  });

  // ph (bar) - Note: using data.pH from Firebase
  updateChart('phChart', (chart) => {
    chart.data.datasets[0].data = [data.pH || data.ph || 0]; // Handle both cases
  });

  // tds (line)
  updateChart('tdsChart', (chart) => {
    pushTimeLabel(chart);
    chart.data.datasets[0].data.push(data.tds || 0);
  });

  // turbidity (bubble)
  updateChart('turbidityChart', (chart) => {
    const v = data.turbidity || 0;
    chart.data.datasets[0].data = [{x:1, y:v, r: Math.min(30, Math.max(6, v*3))}];
  });

  // chlorine (doughnut)
  updateChart('chlorineChart', (chart) => {
    const v = data.chlorine || 0;
    chart.data.datasets[0].data = [v, Math.max(0, 100 - v)];
  });

  // inflow (line)
  updateChart('inflowChart', (chart) => {
    pushTimeLabel(chart);
    chart.data.datasets[0].data.push(data.inflow || 0);
  });

  // outflow (line)
  updateChart('outflowChart', (chart) => {
    pushTimeLabel(chart);
    chart.data.datasets[0].data.push(data.outflow || 0);
  });

  // usage (doughnut)
  updateChart('usageChart', (chart) => {
    const v = data.usage || 0;
    chart.data.datasets[0].data = [v, 100 - v];
  });

  // leak indicator
  const leakEl = document.getElementById('leakIndicator');
  if (leakEl) {
    leakEl.classList.toggle('leak-on', 
      data.leak === true || data.leak === 'true' || data.leak === 1
    );
  }
}

/* ------------------ Leak animation fallback ------------------ */
function animateLeak() {
  const leak = document.getElementById('leakIndicator');
  setInterval(() => {
    if (!leak.classList.contains('leak-on')) {
      leak.style.transform = leak.style.transform === 'scale(1.05)' ? 'scale(1)' : 'scale(1.05)';
    } else {
      leak.style.transform = 'scale(1.1)';
    }
  }, 1000);
}






const reportSection = document.getElementById('water-report');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      reportSection.classList.add('in-view');
    }
  });
}, {threshold: 0.1});

observer.observe(reportSection);



/* ------------------ Fake data updater for demo ------------------ */
import { set } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

function randomValue(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(1);
}

setInterval(() => {
  const fakeData = {
    chlorine: randomValue(5, 10),
    inflow: randomValue(0, 20),
    leak: Math.random() > 0.8, // 20% chance of leak
    oH: randomValue(7, 9),
    outflow: randomValue(0, 20),
    pH: randomValue(4, 9),
    tankCapacity: randomValue(20,50),
    tds: randomValue(30, 70),
    temperature: randomValue(20, 35),
    timestamp: new Date().toISOString().replace("T", " ").split(".")[0],
    turbidity: randomValue(5, 15),
    usage: randomValue(10, 50)
  };

  set(ref(db, "WaterData"), fakeData)
    .then(() => console.log("Fake data pushed:", fakeData))
    .catch(console.error);
}, 1000); // updates every 5 seconds
