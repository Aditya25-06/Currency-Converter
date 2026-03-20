// Currency list with full names
const currencyList = {
  USD: "United States Dollar",
  EUR: "Euro",
  JPY: "Japanese Yen",
  GBP: "British Pound Sterling",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  HKD: "Hong Kong Dollar",
  NZD: "New Zealand Dollar",
  SEK: "Swedish Krona",
  KRW: "South Korean Won",
  SGD: "Singapore Dollar",
  NOK: "Norwegian Krone",
  MXN: "Mexican Peso",
  INR: "Indian Rupee",
  RUB: "Russian Ruble",
  ZAR: "South African Rand",
  TRY: "Turkish Lira",
  BRL: "Brazilian Real",
  TWD: "Taiwan Dollar",
  DKK: "Danish Krone",
  PLN: "Polish Zloty",
  THB: "Thai Baht",
  IDR: "Indonesian Rupiah",
  HUF: "Hungarian Forint",
  CZK: "Czech Koruna",
  ILS: "Israeli Shekel",
  CLP: "Chilean Peso",
  PHP: "Philippine Peso",
  AED: "UAE Dirham",
  COP: "Colombian Peso",
  SAR: "Saudi Riyal",
  MYR: "Malaysian Ringgit",
  RON: "Romanian Leu",
  BGN: "Bulgarian Lev",
  VND: "Vietnamese Dong",
  EGP: "Egyptian Pound",
  PKR: "Pakistani Rupee",
  NGN: "Nigerian Naira",
  BDT: "Bangladeshi Taka",
  KZT: "Kazakhstani Tenge",
  QAR: "Qatari Riyal",
  UAH: "Ukrainian Hryvnia",
  KWD: "Kuwaiti Dinar",
  OMR: "Omani Rial",
  JOD: "Jordanian Dinar",
  MAD: "Moroccan Dirham",
  LKR: "Sri Lankan Rupee",
  DOP: "Dominican Peso",
  KES: "Kenyan Shilling",
  TZS: "Tanzanian Shilling",
  UGX: "Ugandan Shilling",
  GHS: "Ghanaian Cedi",
  NPR: "Nepalese Rupee",
  BHD: "Bahraini Dinar",
  HRK: "Croatian Kuna",
  ISK: "Icelandic Krona",
  MUR: "Mauritian Rupee",
  BWP: "Botswanan Pula",
  BYN: "Belarusian Ruble",
  RSD: "Serbian Dinar",
  PEN: "Peruvian Sol",
  ARS: "Argentine Peso",
  UYU: "Uruguayan Peso",
  IQD: "Iraqi Dinar",
  SDG: "Sudanese Pound",
  LYD: "Libyan Dinar",
  GEL: "Georgian Lari",
  AZN: "Azerbaijani Manat",
  AMD: "Armenian Dram",
  MKD: "Macedonian Denar",
  ALL: "Albanian Lek",
  BAM: "Bosnia-Herzegovina Mark",
  BTN: "Bhutanese Ngultrum",
  BZD: "Belize Dollar",
  FJD: "Fijian Dollar",
  HTG: "Haitian Gourde",
  JMD: "Jamaican Dollar",
  KGS: "Kyrgyzstani Som",
  LAK: "Laotian Kip",
  LBP: "Lebanese Pound",
  MDL: "Moldovan Leu",
  MNT: "Mongolian Tugrik",
  MZN: "Mozambican Metical",
  NAD: "Namibian Dollar",
  NIO: "Nicaraguan Córdoba",
  PGK: "Papua New Guinean Kina",
  SBD: "Solomon Islands Dollar",
  SCR: "Seychellois Rupee",
  SLL: "Sierra Leonean Leone",
  SVC: "Salvadoran Colón",
  SZL: "Swazi Lilangeni",
  TOP: "Tongan Paʻanga",
  TTD: "Trinidad & Tobago Dollar",
  TND: "Tunisian Dinar",
  XAF: "Central African CFA Franc",
  XCD: "East Caribbean Dollar"
};

const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const result = document.getElementById("result");
let chart;

// Populate dropdowns with full names
Object.keys(currencyList).forEach(code => {
  const option1 = document.createElement("option");
  option1.value = code;
  option1.text = `${code} - ${currencyList[code]}`;
  fromCurrency.add(option1);

  const option2 = document.createElement("option");
  option2.value = code;
  option2.text = `${code} - ${currencyList[code]}`;
  toCurrency.add(option2);
});

// Auto-detect user currency
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

// Fake 7-day history
async function fetchHistory(from, to) {
  const labels = [];
  const dataPoints = [];
  const today = new Date();

  for(let i=6;i>=0;i--){
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    labels.push(date.toISOString().split("T")[0]);
    dataPoints.push(Math.random() * (1.2 - 0.8) + 0.8);
  }
  return {labels, dataPoints};
}

// Chart
function drawChart(labels, dataPoints, from, to){
  if(chart) chart.destroy();
  chart = new Chart(document.getElementById("historyChart"), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${from} → ${to}`,
        data: dataPoints,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102,126,234,0.2)',
        tension: 0.3,
        fill: true,
      }]
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
    result.innerText = `${amount} ${currencyList[from]} = ${converted.toFixed(2)} ${currencyList[to]}`;
    const history = await fetchHistory(from, to);
    drawChart(history.labels, history.dataPoints, from, to);
  }
});