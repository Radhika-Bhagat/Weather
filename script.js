let cityInput = document.getElementById("city-input"),
searchBtn = document.getElementById("searchBtn"),
locationBtn = document.getElementById("currentLocationBtn"),
api_key = "6cc4df4d44429cc0f2e1b5b99a04ac96",
currentWeatherCard = document.querySelectorAll(".weather-left .card")[0],
fiveDaysForecastCard = document.querySelector(".day-forecast"),
aqiCard = document.querySelectorAll(".highlights .card")[0],
sunriseCard = document.querySelectorAll(".highlights .card")[1],
aqiList = ["Good", "Fair","Moderate", "Poor", "Very Poor"],
humidityVal = document.getElementById("humidityVal"),
pressureVal = document.getElementById("pressureVal"),
visibilityVal = document.getElementById("visibilityVal"),
windSpeedVal = document.getElementById("windSpeedVal"),
hourlyForecastCard = document.querySelector(".hourly-forecast"),
feelsLikeVal = document.getElementById("feelsVal");


function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    fetch(AIR_POLLUTION_API_URL)
        .then(response => response.json())
        .then(data => {
            let {co,no,no2,o3,so2,pm2_5,pm10,nh3} = data.list[0].components;
            aqiCard.innerHTML = `
                <div class="card-head">
                        <p>Air Quality Index</p>
                        <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
                    </div>
                    <div class="air-indices">
                        <img width="50" height="50" src="https://img.icons8.com/color/50/air-element.png" alt="air-element"/>
                        <div class="items">
                            <p>PM2.5</p>
                            <h2>${pm2_5}</h2>
                        </div>
                        <div class="items">
                            <p>PM10</p>
                            <h2>${pm10}</h2>
                        </div>
                        <div class="items">
                            <p>SO2</p>
                            <h2>${so2}</h2>
                        </div>
                        <div class="items">
                            <p>CO</p>
                            <h2>${co}</h2>
                        </div>
                        <div class="items">
                            <p>NO</p>
                            <h2>${no}</h2>
                        </div>
                        <div class="items">
                            <p>NO2</p>
                            <h2>${no2}</h2>
                        </div>
                        <div class="items">
                            <p>NH3</p>
                            <h2>${nh3}</h2>
                        </div>
                        <div class="items">
                            <p>O3</p>
                            <h2>${o3}</h2>
                        </div>
                    </div>
            `;
        })
        .catch(error => console.error("Error fetching air pollution data:", error));

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            let date = new Date();
            currentWeatherCard.innerHTML = `
            <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-regular fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                    <p><i class="fa-solid fa-location-dot"></i>${name}, ${state}, ${country}</p>
                </div>`;
            let {sunrise, sunset} = data.sys,
            {timezone, visibility} = data,
            {humidity, pressure, feels_like} = data.main,
            {speed} = data.wind,
            sRiseTime = moment.utc(sunrise, 'X').utcOffset(timezone/60).format('HH:mm'),
            sSetTime = moment.utc(sunset, 'X').utcOffset(timezone/60).format('HH:mm');
            sunriseCard.innerHTML = `
                <div class="card-head">
                    <p>Sunrise & Sunset</p>
                </div>
                <div class="sun-times">
                    <div class="sunrise">
                        <img width="50" height="50" src="https://img.icons8.com/fluency/48/sunrise--v1.png" alt="sunrise--v1"/>
                        <div class="time">
                            <p>Sunrise</p>
                            <h2>${sRiseTime}</h2>
                        </div>
                    </div>
                    <div class="sunset">
                        <img width="50" height="50" src="https://img.icons8.com/fluency/48/sunset--v1.png" alt="sunset--v1"/>
                        <div class="time">
                            <p>Sunset</p>
                            <h2>${sSetTime}</h2>
                        </div>
                    </div>
                </div>
            `;
            humidityVal.innerText = `${humidity}%`;
            pressureVal.innerText = `${pressure} hPa`;
            visibilityVal.innerText = `${(visibility / 1000).toFixed(2)} km`;
            windSpeedVal.innerText = `${speed} m/s`;
            feelsLikeVal.innerText = `${(feels_like - 273.15).toFixed(2)}°C`;

        })
        .catch(error => console.error("Error fetching weather data:", error));

    fetch(FORECAST_API_URL)
        .then(response => response.json())
        .then(data => {
            let hourlyForecast = data.list;
            hourlyForecastCard.innerHTML = '';
            for(i=0; i<=7; i++) {
                let forecast = hourlyForecast[i];
                let date = new Date(forecast.dt_txt);
                let hr = date.getHours();
                let a = 'PM';
                if (hr < 12) a = 'AM';
                if(hr == 0) hr = 12;
                if(hr > 12) hr -= 12;
                hourlyForecastCard.innerHTML += `
                    <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="">
                    <p>${(forecast.main.temp - 273.15).toFixed(2)}&deg;C</p>
                    </div>
                `;
            };
            let uniqueForecastDays = [];
            let fiveDaysForecast = data.list.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });
            fiveDaysForecastCard.innerHTML = '';
            for(i=1; i<fiveDaysForecast.length; i++) {
                let date = new Date(fiveDaysForecast[i].dt_txt);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                            <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            }
        })
        .catch(error => console.error("Error fetching forecast data:", error));
}

searchBtn.addEventListener("click", function() {
    let cityName = cityInput.value.trim();
    cityInput.value = "";
    if(!cityName) return;
    let GEO_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEO_API_URL)
        .then(response => response.json())
        .then(data => {
            let {name,lat,lon,country,state} = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(error => console.error("Error fetching city data:", error));
});
locationBtn.addEventListener("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let {latitude, longitude} = position.coords;
            let REVERSE_GEO_API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
            fetch(REVERSE_GEO_API_URL)
                .then(response => response.json())
                .then(data => {
                    let {name, country, state} = data[0];
                    getWeatherDetails(name, latitude, longitude, country, state);
                })
                .catch(error => console.error("Error fetching reverse geocoding data:", error));
        });
    } else {
        alert("Geolocation permission denied. Please allow location access.");
    }
});
cityInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});
window.onload = function() {
    locationBtn.click();

};
