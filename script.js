// Currency list with full names
const currencyList = {
 AED: "UAE Dirham",
ALL: "Albanian Lek",
AMD: "Armenian Dram",
ARS: "Argentine Peso",
AUD: "Australian Dollar",
AZN: "Azerbaijani Manat",
BAM: "Bosnia-Herzegovina Mark",
BDT: "Bangladeshi Taka",
BGN: "Bulgarian Lev",
BHD: "Bahraini Dinar",
BWP: "Botswanan Pula",
BYN: "Belarusian Ruble",
BZD: "Belize Dollar",
BRL: "Brazilian Real",
BTN: "Bhutanese Ngultrum",
CAD: "Canadian Dollar",
CHF: "Swiss Franc",
CLP: "Chilean Peso",
CNY: "Chinese Yuan",
COP: "Colombian Peso",
CZK: "Czech Koruna",
DKK: "Danish Krone",
DOP: "Dominican Peso",
EGP: "Egyptian Pound",
EUR: "Euro",
FJD: "Fijian Dollar",
GEL: "Georgian Lari",
GHS: "Ghanaian Cedi",
GBP: "British Pound Sterling",
HKD: "Hong Kong Dollar",
HRK: "Croatian Kuna",
HTG: "Haitian Gourde",
HUF: "Hungarian Forint",
IDR: "Indonesian Rupiah",
ILS: "Israeli Shekel",
INR: "Indian Rupee",
IQD: "Iraqi Dinar",
ISK: "Icelandic Krona",
JMD: "Jamaican Dollar",
JOD: "Jordanian Dinar",
JPY: "Japanese Yen",
KES: "Kenyan Shilling",
KGS: "Kyrgyzstani Som",
KRW: "South Korean Won",
KWD: "Kuwaiti Dinar",
KZT: "Kazakhstani Tenge",
LAK: "Laotian Kip",
LBP: "Lebanese Pound",
LKR: "Sri Lankan Rupee",
LYD: "Libyan Dinar",
MAD: "Moroccan Dirham",
MDL: "Moldovan Leu",
MKD: "Macedonian Denar",
MNT: "Mongolian Tugrik",
MUR: "Mauritian Rupee",
MXN: "Mexican Peso",
MYR: "Malaysian Ringgit",
MZN: "Mozambican Metical",
NAD: "Namibian Dollar",
NGN: "Nigerian Naira",
NIO: "Nicaraguan Córdoba",
NOK: "Norwegian Krone",
NPR: "Nepalese Rupee",
NZD: "New Zealand Dollar",
OMR: "Omani Rial",
PEN: "Peruvian Sol",
PHP: "Philippine Peso",
PKR: "Pakistani Rupee",
PLN: "Polish Zloty",
PGK: "Papua New Guinean Kina",
QAR: "Qatari Riyal",
RON: "Romanian Leu",
RSD: "Serbian Dinar",
RUB: "Russian Ruble",
SAR: "Saudi Riyal",
SBD: "Solomon Islands Dollar",
SCR: "Seychellois Rupee",
SDG: "Sudanese Pound",
SEK: "Swedish Krona",
SGD: "Singapore Dollar",
SLL: "Sierra Leonean Leone",
SVC: "Salvadoran Colón",
SZL: "Swazi Lilangeni",
THB: "Thai Baht",
TND: "Tunisian Dinar",
TOP: "Tongan Paʻanga",
TRY: "Turkish Lira",
TTD: "Trinidad & Tobago Dollar",
TWD: "Taiwan Dollar",
TZS: "Tanzanian Shilling",
UAH: "Ukrainian Hryvnia",
UGX: "Ugandan Shilling",
USD: "United States Dollar",
UYU: "Uruguayan Peso",
VND: "Vietnamese Dong",
XAF: "Central African CFA Franc",
XCD: "East Caribbean Dollar",
ZAR: "South African Rand"
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