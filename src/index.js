//Update the CSS based on local time of search input
function adjustColorMode(localCityTime) {
  let now = localCityTime.getHours();

  if (now >= 11 && now < 20) {
    document.documentElement.classList.remove("night");
    document.documentElement.classList.remove("morning");
  } else {
    if (now >= 20 || now < 6) {
      document.documentElement.classList.remove("morning");
      document.documentElement.classList.add("night");
    } else {
      if (now >= 6 && now < 11) {
        document.documentElement.classList.remove("night");
        document.documentElement.classList.add("morning");
      }
    }
  }
}

//Current date of search input
function getDate(localCityTime) {
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
  let weekday = weekdays[localCityTime.getDay()];
  let hour = localCityTime.getHours();
  if (hour <= 9) {
    hour = `0${hour}`;
  }
  let minutes = localCityTime.getMinutes();
  if (minutes <= 9) {
    minutes = `0${minutes}`;
  }
  let day = localCityTime.getDate();
  let month = months[localCityTime.getMonth()];
  let year = localCityTime.getFullYear();
  let currentDate = (document.querySelector(
    "#date"
  ).innerHTML = `${weekday}, ${hour}:${minutes},</br>${month} ${day}, ${year}`);

  return currentDate;
}

//Actual local time for searched city
function getInputCityTime(timestamp, timezone) {
  let dateTime = new Date(timestamp * 1000);
  let toUtc = dateTime.getTime() + dateTime.getTimezoneOffset() * 60000;
  let currentLocalTime = toUtc + 1000 * timezone;
  let selectedDate = new Date(currentLocalTime);

  let hour = selectedDate.getHours();

  console.log(selectedDate);

  getDate(selectedDate);
  adjustColorMode(selectedDate);
  return selectedDate;
}

//Weather forecast date formats
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

//Weather forecast
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `           <div class="d-flex flex-column weather-fore">
                  <div class="weather-forecast-date">${formatDay(
                    forecastDay.dt
                  )}</div>
                  <img
                    src="http://www.openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon
                    }@2x.png"
                    alt=""
                    class="forecast-icon"
                  />
                  <div class="weather-forecast-temperature">
                    <span class="weather-forecast-temperature-min">${Math.round(
                      forecastDay.temp.min
                    )}° </span
                    ><span class="weather-forecast-temperature-max">${Math.round(
                      forecastDay.temp.max
                    )}°</span>
                  </div>
                </div>
                <hr />
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//Fetch Weather Forecast API
function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "1fd8093fa5ff12d796d7de756cc9d6b9";
  let apiEndpointForecast = `https://api.openweathermap.org/data/2.5/onecall?`;
  let apiUrlForecast = `${apiEndpointForecast}lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrlForecast).then(displayForecast);
}

//DOM manipulation for current weather
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

  getForecast(response.data.coord);
  changeQuote(weatherDescription);
  getInputCityTime(response.data.dt, response.data.timezone);
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

//Get input from search form
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchCity(city);
}

//Get current geolocation
function showCurrentLocation() {
  navigator.geolocation.getCurrentPosition(retrieveWeatherLocation);
}

//Temperature conversion to Fahrenheit
function changeToFahrenheit(event) {
  event.preventDefault();
  let temp = document.querySelector("#temperature");
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  temp.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
}

//Temperature conversion to Celsius
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

let containerDark = document.querySelector("#container-all");
let quoteDark = document.querySelector("#daily-quote");
let temperatureDark = document.querySelector("#temperature");
let cityDark = document.querySelector("#city");
let countryDark = document.querySelector("#country");

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
