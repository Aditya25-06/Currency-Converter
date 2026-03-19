const currencies = ["USD","EUR","INR","GBP","JPY","AUD","CAD"];
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const result = document.getElementById("result");
let chart; // Chart.js instance

// Populate dropdowns
currencies.forEach(cur => {
  const option1 = document.createElement("option");
  option1.value = cur; option1.text = cur;
  fromCurrency.add(option1);

  const option2 = document.createElement("option");
  option2.value = cur; option2.text = cur;
  toCurrency.add(option2);
});

// Auto-detect local currency
const userCurrency = Intl.NumberFormat().resolvedOptions().currency || "USD";
fromCurrency.value = userCurrency;

// Convert function
async function convertCurrency(amount, from, to) {
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/c3257c9595331b8d62d110fa/latest/${from}`);
    const data = await response.json();
    const rate = data.conversion_rates[to];
    return rate ? amount * rate : null;
  } catch (error) {
    alert("Error fetching rates."); 
    console.error(error);
  }
}

// Simulate 7-day history (for free API)
async function fetchHistory(from, to) {
  const days = 7;
  const labels = [];
  const dataPoints = [];
  const today = new Date();

  for(let i=days-1;i>=0;i--){
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    labels.push(date.toISOString().split("T")[0]);
    dataPoints.push(Math.random() * (1.2 - 0.8) + 0.8); // simulate variation
  }
  return {labels, dataPoints};
}

// Draw chart
function drawChart(labels, dataPoints, from, to){
  if(chart) chart.destroy();
  chart = new Chart(document.getElementById("historyChart"), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${from} → ${to} rate (approx)`,
        data: dataPoints,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102,126,234,0.2)',
        tension: 0.3,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

// Button click
document.getElementById("convertBtn").addEventListener("click", async () => {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount) return alert("Enter a valid amount");

  const converted = await convertCurrency(amount, from, to);
  if(converted){
    result.innerText = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
    const history = await fetchHistory(from, to);
    drawChart(history.labels, history.dataPoints, from, to);
  }
});