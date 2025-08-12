const apiKey = "f82b7cf775bc52a65102d85845062e3f";

// Trigger Get Weather
async function getWeather(cityNameFromHistory = null) {
  const city = cityNameFromHistory || document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name.");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    showWeather(data);
    saveToHistory(city);
  } catch (error) {
    document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
  }
}

// Show Weather
function showWeather(data) {
  const { name, main, weather, wind } = data;
  const icon = getWeatherIcon(weather[0].main.toLowerCase());

  document.getElementById("weatherResult").innerHTML = `
    <div class="weather-icon"><i class="wi ${icon}"></i></div>
    <h2>${name}</h2>
    <p><strong>🌡 Temp:</strong> ${main.temp}°C</p>
    <p><strong>☁ Condition:</strong> ${weather[0].main} (${weather[0].description})</p>
    <p><strong>💧 Humidity:</strong> ${main.humidity}%</p>
    <p><strong>🌬 Wind:</strong> ${wind.speed} m/s</p>
  `;
}

// Get Icon Class
function getWeatherIcon(condition) {
  if (condition.includes("clear")) return "wi-day-sunny";
  if (condition.includes("cloud")) return "wi-cloudy";
  if (condition.includes("rain")) return "wi-rain";
  if (condition.includes("snow")) return "wi-snow";
  if (condition.includes("thunder")) return "wi-thunderstorm";
  if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) return "wi-fog";
  return "wi-na";
}

// Add Enter Key
document.getElementById("cityInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") getWeather();
});

// Auto Fetch from Location
window.onload = function () {
  loadHistory();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        showWeather(data);
      } catch {
        document.getElementById("weatherResult").innerHTML = `<p>Unable to fetch location-based weather data.</p>`;
      }
    });
  }
};

// 🌙 Dark/Light Mode
document.getElementById("modeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  document.getElementById("modeToggle").textContent = isLight ? "🌚" : "🌙";
});

// 📍 Search History
function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.unshift(city);
    if (history.length > 5) history.pop();
    localStorage.setItem("weatherHistory", JSON.stringify(history));
    loadHistory();
  }
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  const container = document.getElementById("searchHistory");
  container.innerHTML = "<h4>Search History</h4>";
  history.forEach((city) => {
    const p = document.createElement("p");
    p.textContent = city;
    p.onclick = () => getWeather(city);
    container.appendChild(p);
  });
}
