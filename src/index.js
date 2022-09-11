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

//
//
//
function getCurrentWeather(response) {
  let currentTemperature = (document.querySelector("#temperature").innerHTML =
    Math.round(response.data.main.temp));

  celsiusTemperature = response.data.main.temp;

  let currentCountry = (document.querySelector("#country").innerHTML =
    response.data.sys.country);

  let currentCity = (document.querySelector("#city").innerHTML =
    response.data.name);

  let currentWeather = (document.querySelector("#current-weather").innerHTML =
    response.data.weather[0].main);

  weatherDescription = response.data.weather[0].main;

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
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);

  changeQuote(weatherDescription);
}

//Search engine & Weather API
function searchCity(city) {
  let units = `metric`;
  let apiKey = "56e3c80227c38c7f7a05b24686a60ec1";
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;
  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(getCurrentWeather);
}

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

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchCity(city);
}

function showCurrentLocation() {
  navigator.geolocation.getCurrentPosition(retrieveWeatherLocation);
}

//Temperature conversion
function changeToFahrenheit(event) {
  event.preventDefault();
  let temp = document.querySelector("#temperature");
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  temp.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
}

function changeToCelsius(event) {
  event.preventDefault();
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
  let temp = document.querySelector("#temperature");
  temp.innerHTML = Math.round(celsiusTemperature);
}

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", showCurrentLocation);

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let searchButton = document.querySelector("#search-addon");
searchButton.addEventListener("click", handleSubmit);
searchButton.addEventListener("keyup", handleSubmit);

let celsiusTemperature = null;

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", changeToFahrenheit);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", changeToCelsius);

//
//Default city
searchCity("Berlin");

//
//Daily quotes
function changeQuote(weather) {
  let quote = document.querySelector("#daily-quote");
  if (weather === "Clear") {
    quote.innerHTML = `"Keep your eyes lifted high upon the sun, and you'll see the best light in everyone."`;
  } else {
    if (weather === `Clouds`) {
      quote.innerHTML = `"The sky and the sun are always there. It's the clouds that come and go."`;
    } else {
      quote.innerHTML = `"Smell the rain, and feel the sky. Let your soul and spirit fly."`;
    }
  }
}

let weatherDescription = null;
