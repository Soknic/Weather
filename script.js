const timeElem = document.getElementById("time");
const dateElem = document.getElementById("date");
const currentWeatherItems = document.getElementById("current-weather-items");
const timeZone = document.getElementById("time-zone");
const countryElem = document.getElementById("country");
const weatherForecastElem = document.getElementById("weather-forecast");
const currentTempElem = document.getElementById("current-temp");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "b7f913692e399a8ce727bf392fe00d00";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  timeElem.innerHTML =
    (hoursIn12HrFormat < 10? "0"+hoursIn12HrFormat : hoursIn12HrFormat) + ":" + (minutes <10? "0"+minutes : minutes) + "" + `<span id="am-pm">${ampm}</span>`;

  dateElem.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
  timeZone.innerHTML=data.timezone;
  countryElem.innerHTML=data.lat+ "N "+ data.lon+"E"
  currentWeatherItems.innerHTML = 
  `<div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}</div>
  </div>
  <div class="weather-item">
    <div>Pressure</div>
    <div>${pressure}</div>
  </div>
  <div class="weather-item">
    <div>Wind Speed</div>
    <div>${wind_speed}</div>
  </div>
  <div class="weather-item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
  </div>
  <div class="weather-item">
    <div>Sunset</div>
    <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
  </div>
  `;
  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
        currentTempElem.innerHTML=`<img
        src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
        alt="weather"
        class="w-icon"
      />
      <div class="other">
        <div class="day">${window.moment(day.dt* 1000).format("ddd")}</div>
        <div class="temp">Night  ${day.temp.night.toFixed(1)}&#176; C</div>
        <div class="temp">Day  ${day.temp.day.toFixed(1)}&#176; C</div>
      </div>
        `
    } else {
      otherDayForcast += 
      `<div class="weather-forecast-item">
      <div class="day">${window.moment(day.dt* 1000).format("ddd")}</div>
      <img
        src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
        alt="weather"
        class="w-icon"
      />
      <div class="temp">Night  ${day.temp.night.toFixed(1)}&#176; C</div>
      <div class="temp">Day  ${day.temp.day.toFixed(1)}&#176; C</div>
    </div>`;
    }
  });

  weatherForecastElem.innerHTML=otherDayForcast
}
