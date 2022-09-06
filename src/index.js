//Current date
function getDate(now) {
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let weekday = weekdays[now.getDay()];
  let hour = now.getHours();
  if (hour <= 9) {
    hour = `0${hour}`;
  }
  let minutes = now.getMinutes();
  if (minutes <= 9) {
    minutes = `0${minutes}`;
  }
  let day = now.getDate();
  let month = months[now.getMonth()];
  let year = now.getFullYear();
  let currentDate = document.querySelector("#date");
  currentDate.innerHTML = `${weekday}, ${hour}:${minutes},</br>${month} ${day}, ${year}`;

  return currentDate;
}
getDate(new Date());

//Search engine & Weather API
function searchCity(city) {
  let units = `metric`;
  let apiKey = "56e3c80227c38c7f7a05b24686a60ec1";
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;
  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(getCurrentWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchCity(city);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
let searchButton = document.querySelector("#search-addon");
searchButton.addEventListener("click", handleSubmit);
searchButton.addEventListener("keyup", handleSubmit);

//Default city
searchCity("Berlin");

//CURRENT Weather API & Geolocation API
function retrieveWeatherLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = `metric`;
  let apiKey = "56e3c80227c38c7f7a05b24686a60ec1";
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(getCurrentWeather);
}

function getCurrentWeather(response) {
  let currentTemperature = (document.querySelector("#temperature").innerHTML =
    Math.round(response.data.main.temp));

  console.log(response.data);
  let currentCountry = (document.querySelector("#country").innerHTML =
    response.data.sys.country);

  let currentCity = (document.querySelector("#city").innerHTML =
    response.data.name);

  let currentWeather = (document.querySelector("#current-weather").innerHTML =
    response.data.weather[0].main);

  let minTemperature = (document.querySelector("#min-temp").innerHTML =
    Math.round(response.data.main.temp_min));

  let maxTemperature = (document.querySelector("#max-temp").innerHTML =
    Math.round(response.data.main.temp_max));

  let currentPrecipitation = (document.querySelector(
    "#precipitation"
  ).innerHTML = Math.round(response.data.rain));
  console.log(currentPrecipitation);
  let precip = response.data.rain;
  let precipitation = document.querySelector("#precipitation");
  if (precip == null) {
    precipitation.innerHTML = `0`;
  }

  let currentWindSpeed = (document.querySelector("#wind-speed").innerHTML =
    Math.round(response.data.wind.speed));

  let currentHumidity = (document.querySelector("#humidity").innerHTML =
    Math.round(response.data.main.humidity));

  let weatherIcon = document.querySelector("#icon-sun");
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png)`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
}

function showCurrentLocation() {
  navigator.geolocation.getCurrentPosition(retrieveWeatherLocation);
}

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", showCurrentLocation);

//Temperature conversion
function changeToCelsius(event) {
  event.preventDefault();
  let tempC = document.querySelector("#temperature");
  let celsiusCalculation = tempC.innerHTML;
  celsiusCalculation = Number(celsiusCalculation);
  tempC.innerHTML = Math.round(((celsiusCalculation - 32) * 5) / 9);
}
let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", changeToCelsius);

function changeToFahrenheit(event) {
  event.preventDefault();
  let temp = document.querySelector("#temperature");
  let fahrenheitCalculation = temp.innerHTML;
  fahrenheitCalculation = Number(fahrenheitCalculation);
  temp.innerHTML = Math.round((fahrenheitCalculation * 9) / 5 + 32);
}
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", changeToFahrenheit);

//Daily quotes
function changeQuote(weather) {
  let quote = document.querySelector("#daily-quote").innerHTML;
  if (weather === `Clear`) {
    quote = `"To find happiness, you must be your own sunshine"`;
  } else {
    quote = `"Smell the rain, and feel the sky. Let your soul and spirit fly."`;
  }
}
let currentWeather = document.querySelector("#current-weather").innerHTML;
changeQuote(currentWeather);
