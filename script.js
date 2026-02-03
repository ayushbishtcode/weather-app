const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const forecastContainer = document.getElementById("forecast");

const API_KEY = "20eae181e73acf3d5c3a8cb3c7e0e50d";

searchBtn.addEventListener("click", getForecast);
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getForecast();
});

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function setBackground(condition) {
  document.body.className = "";
  condition = condition.toLowerCase();

  if (condition.includes("cloud")) document.body.classList.add("cloudy");
  else if (condition.includes("rain")) document.body.classList.add("rainy");
  else if (condition.includes("clear")) document.body.classList.add("clear");
  else document.body.classList.add("default");
}

function getForecast() {
  const city = cityInput.value.trim();
  if (!city) return alert("Enter city name");

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&mode=xml&appid=${API_KEY}`,
  )
    .then((res) => res.text())
    .then((text) => {
      const xml = new DOMParser().parseFromString(text, "application/xml");
      displayForecast(xml);
    })
    .catch(() => alert("Unable to fetch weather"));
}

function displayForecast(xml) {
  forecastContainer.innerHTML = "";

  const city = xml.querySelector("location > name").textContent;
  const country = xml.querySelector("location > country").textContent;

  const title = document.createElement("h2");
  title.textContent = `${city}, ${country}`;
  forecastContainer.appendChild(title);

  const wrapper = document.createElement("div");
  wrapper.className = "forecast-wrapper";

  const times = xml.querySelectorAll("forecast > time");

  const mainCondition = times[0].querySelector("symbol").getAttribute("name");

  setBackground(mainCondition);

  for (let i = 0; i < 8; i++) {
    const t = times[i];

    const dateTime = formatDateTime(t.getAttribute("from"));
    const temp = (
      t.querySelector("temperature").getAttribute("value") - 273.15
    ).toFixed(1);
    const condition = t.querySelector("symbol").getAttribute("name");
    const icon = t.querySelector("symbol").getAttribute("var");

    const card = document.createElement("div");
    card.className = "forecast-card";

    card.innerHTML = `
      <p class="date">🕒 ${dateTime}</p>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />
      <p class="temp">${temp}°C</p>
      <p class="condition">${condition}</p>
    `;

    wrapper.appendChild(card);
  }

  forecastContainer.appendChild(wrapper);
}
