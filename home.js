document.addEventListener('DOMContentLoaded', () => {
  const scroller = document.querySelector('.scroll-stack-scroller');
  const cards = document.querySelectorAll('.scroll-stack-card');
  
  // Initial transform for all cards
  cards.forEach((card, index) => {
    // Stagger the initial position slightly for a nicer effect
    card.style.transform = `translateY(${index * 20}px) scale(${1 - index * 0.05})`;
    card.style.filter = `brightness(${1 - index * 0.1})`;
  });
  
  // Scroll event listener
  scroller.addEventListener('scroll', () => {
    const scrollTop = scroller.scrollTop;
    
    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardOffset = cardRect.top + scrollTop;
      const scrollProgress = (scrollTop - cardOffset + window.innerHeight * 0.8) / (window.innerHeight * 0.8);
      
      // Apply transforms based on scroll position
      if (scrollProgress > 0 && scrollProgress < 1) {
        const scale = 1 - Math.max(0, scrollProgress * 0.2);
        const brightness = 1 - Math.max(0, scrollProgress * 0.3);
        card.style.transform = `translateY(${scrollProgress * 40}px) scale(${scale})`;
        card.style.filter = `brightness(${brightness})`;
      } else if (scrollProgress <= 0) {
        // Card is below viewport - reset to initial state
        card.style.transform = 'translateY(0) scale(1)';
        card.style.filter = 'brightness(1)';
      } else {
        // Card is above viewport - apply maximum transform
        card.style.transform = 'translateY(40px) scale(0.8)';
        card.style.filter = 'brightness(0.7)';
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
  setTimeout(showPeakUsage, 3500); // Wait for animation to complete
});

function showPeakUsage() {
  // Get all data points from the graph
  const polylines = document.querySelectorAll('.graph-line');
  let peakValue = 0;
  let peakTime = 0;
  
  // Find the highest point across all lines
  polylines.forEach(polyline => {
    const points = polyline.getAttribute('points').split(' ');
    points.forEach(point => {
      const [x, y] = point.split(',').map(Number);
      if (y > peakValue) {
        peakValue = y;
        peakTime = x;
      }
    });
  });
  
  // Convert x-position to time period (adjust based on your x-axis)
  const timePeriod = Math.round((peakTime / 430) * 12) || 1;
  
  // Display the message
  const message = `You have used <span class="highlight">${peakValue}</span> gallons of water at <span class="highlight">${timePeriod}${getOrdinalSuffix(timePeriod)}</span> time period`;
  document.getElementById('water-usage-text').innerHTML = message;
}

// Helper function for ordinal suffixes (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(num) {
  const j = num % 10, k = num % 100;
  if (j == 1 && k != 11) return 'st';
  if (j == 2 && k != 12) return 'nd';
  if (j == 3 && k != 13) return 'rd';
  return 'th';
}




// pH Graph Code
const timeLabels = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
const phValues = [7.1, 7.0, 6.9, 7.2, 7.3, 7.2, 7.1, 6.8, 6.9, 7.0, 7.2, 7.1, 7.3, 7.4, 7.2, 7.3, 7.1, 7.0, 6.9, 7.0, 7.2, 7.3, 7.1, 7.2];

// Update display
document.getElementById("currentPH").textContent = phValues[phValues.length-1].toFixed(1);

// Create chart
new Chart(document.getElementById('phChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: timeLabels,
    datasets: [{
      data: phValues,
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
      tension: 0.3,
      fill: true
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { min: 0, max: 14, title: { display: true, text: 'pH Value' } },
      x: { title: { display: true, text: 'Time (24h)' } }
    }
  }
});


const phChart = new Chart(document.getElementById('phChart'), {
  type: 'line',
  data: { /* your data */ },
  options: {
    responsive: true,
    maintainAspectRatio: false, // Important for custom sizing
    /* rest of your options */
  }
});

// Handle window resizing
window.addEventListener('resize', function() {
  phChart.resize();
});


// Water Quality Pie Chart
function initQualityChart() {
  const ctx = document.getElementById('qualityPieChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Excellent', 'Moderate', 'Poor'],
      datasets: [{
        data: [65, 25, 10],
        backgroundColor: [
          '#28a745', // green
          '#ffc107', // yellow
          '#dc3545'  // red
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });
}

// Initialize when scrolled to
document.addEventListener('DOMContentLoaded', function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initQualityChart();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(document.querySelector('.water-quality-section'));
});

// Temperature Chart Initialization
function initTemperatureChart() {
  const timeLabels = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const tempValues = [
    24.2, 23.9, 23.7, 23.5, 23.4, 23.2, 23.5, 24.0, 25.1, 26.0, 26.5, 27.2,
    28.1, 28.4, 28.0, 27.3, 26.5, 25.4, 24.8, 24.1, 23.7, 23.6, 23.5, 23.3
  ];

  const ctx = document.getElementById('temperatureChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [{
        label: 'Temperature (°C)',
        data: tempValues,
        borderColor: '#ff5722',
        backgroundColor: 'rgba(255, 87, 34, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: '°C'
          },
          min: 20,
          max: 30
        },
        x: {
          title: {
            display: true,
            text: 'Time (24h)'
          }
        }
      }
    }
  });
}

// Call this when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initTemperatureChart();
});