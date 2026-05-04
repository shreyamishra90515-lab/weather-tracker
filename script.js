const apiKey = "YOUR_API_KEY";

window.onload = loadHistory;

// Add logs to UI
function log(msg) {
  console.log(msg);
  document.getElementById("logs").innerHTML += msg + "<br>";
}

// MAIN FUNCTION
async function getWeather(cityName) {
  let city = cityName || document.getElementById("city").value;

  if (!city) {
    alert("Enter city");
    return;
  }

  document.getElementById("logs").innerHTML = "";

  log("Sync Start");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    log("[ASYNC] Start fetching");

    let res = await fetch(url);

    log("Promise then (microtask)");

    if (!res.ok) throw new Error("City not found");

    let data = await res.json();

    showWeather(data);
    saveHistory(city);

    log("[ASYNC] Data received");

  } catch (err) {
    document.getElementById("result").innerHTML =
      `<p style="color:red;">${err.message}</p>`;
  }

  setTimeout(() => {
    log("setTimeout (macrotask)");
  }, 0);

  log("Sync End");
}

// SHOW DATA
function showWeather(data) {
  document.getElementById("result").innerHTML = `
    <p><b>City:</b> ${data.name}</p>
    <p><b>Temp:</b> ${data.main.temp} °C</p>
    <p><b>Weather:</b> ${data.weather[0].description}</p>
    <p><b>Humidity:</b> ${data.main.humidity}%</p>
    <p><b>Wind:</b> ${data.wind.speed} m/s</p>
  `;
}

// SAVE HISTORY
function saveHistory(city) {
  let list = JSON.parse(localStorage.getItem("cities")) || [];

  if (!list.includes(city)) {
    list.push(city);
    localStorage.setItem("cities", JSON.stringify(list));
  }

  loadHistory();
}

// LOAD HISTORY
function loadHistory() {
  let list = JSON.parse(localStorage.getItem("cities")) || [];
  let box = document.getElementById("history");

  box.innerHTML = "";

  list.forEach(city => {
    let span = document.createElement("span");
    span.innerText = city;

    span.onclick = () => getWeather(city);

    box.appendChild(span);
  });
}