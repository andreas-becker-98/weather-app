const OPENWEATHER_API_KEY = "a1e0f54713be1d1d848f352296f8aaa7";
const DAYS_OF_THE_WEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function displayWeatherFor(placeName, onSuccess, onError, useCelsius = true) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${placeName}&limit=3&appid=${OPENWEATHER_API_KEY}`)
        .then((resp) => {
            if(!resp || !resp.ok) {
                return Promise.reject("Could not get a response from the API.");
            }
            return resp.json();
        }).then((data) => {
            if (!data || data.length === 0) {
                return Promise.reject(`Could not find a place called "${placeName}"`);
            }
            return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&units=${useCelsius ? "metric" : "imperial"}&appid=${OPENWEATHER_API_KEY}`);
        }).then((resp) => {
            if(!resp.ok) {
                return Promise.reject("Couldn't fetch weather information");
            }
            return resp.json();
        }).then((data) => {
            onSuccess({ city: data.name, temp: data.main.temp, description: data.weather[0].description });
        }).catch((err) => onError(err));
}

function displayFiveDayForecast(placeName, onError, useCelsius = true) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${placeName}&limit=3&appid=${OPENWEATHER_API_KEY}`)
        .then((resp) => {
            if(!resp || !resp.ok) {
                return Promise.reject("Could not get a response from the API.");
            }
            return resp.json();
        }).then((data) => {
            if (!data || data.length === 0) {
                return Promise.reject(`Could not find a place called "${placeName}"`);
            }
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&units=${useCelsius ? "metric" : "imperial"}&appid=${OPENWEATHER_API_KEY}`);
        }).then((resp) => {
            return resp.json()
        }).then((data) => {
            const noonTemps = data.list.filter(x => x.dt_txt.includes("12:00"));
    
            forecastEls.day1.dotw.innerText = `${DAYS_OF_THE_WEEK[new Date(noonTemps[0].dt * 1000).getDay()]}`;
            forecastEls.day2.dotw.innerText = `${DAYS_OF_THE_WEEK[new Date(noonTemps[1].dt * 1000).getDay()]}`;
            forecastEls.day3.dotw.innerText = `${DAYS_OF_THE_WEEK[new Date(noonTemps[2].dt * 1000).getDay()]}`;
            forecastEls.day4.dotw.innerText = `${DAYS_OF_THE_WEEK[new Date(noonTemps[3].dt * 1000).getDay()]}`;
            forecastEls.day5.dotw.innerText = `${DAYS_OF_THE_WEEK[new Date(noonTemps[4].dt * 1000).getDay()]}`;
    
            forecastEls.day1.temp.innerText = `${noonTemps[0].main.temp.toFixed(1)}°C`;
            forecastEls.day2.temp.innerText = `${noonTemps[1].main.temp.toFixed(1)}°C`;
            forecastEls.day3.temp.innerText = `${noonTemps[2].main.temp.toFixed(1)}°C`;
            forecastEls.day4.temp.innerText = `${noonTemps[3].main.temp.toFixed(1)}°C`;
            forecastEls.day5.temp.innerText = `${noonTemps[4].main.temp.toFixed(1)}°C`;
    
            forecastEls.day1.weather.innerText = `${noonTemps[0].weather[0].main}`;
            forecastEls.day2.weather.innerText = `${noonTemps[1].weather[0].main}`;
            forecastEls.day3.weather.innerText = `${noonTemps[2].weather[0].main}`;
            forecastEls.day4.weather.innerText = `${noonTemps[3].weather[0].main}`;
            forecastEls.day5.weather.innerText = `${noonTemps[4].weather[0].main}`;

            carouselEl.style.visibility = "visible";
        }).catch(() => {
            carouselEl.style.visibility = "hidden";
        });
}

const searchBarEl = document.getElementById("search-bar");
const temperatureEl = document.getElementById("current-weather");
const weatherDescriptionEl = document.getElementById("weather-description");
const carouselEl = document.getElementById("carousel");

// Cache the element references for easier access.
const forecastEls = {
    day1: {
        dotw: document.querySelector("#day1 .dotw"),
        temp: document.querySelector("#day1 .temp"),
        weather: document.querySelector("#day1 .weather"),
    },
    day2: {
        dotw: document.querySelector("#day2 .dotw"),
        temp: document.querySelector("#day2 .temp"),
        weather: document.querySelector("#day2 .weather"),
    },
    day3: {
        dotw: document.querySelector("#day3 .dotw"),
        temp: document.querySelector("#day3 .temp"),
        weather: document.querySelector("#day3 .weather"),
    },
    day4: {
        dotw: document.querySelector("#day4 .dotw"),
        temp: document.querySelector("#day4 .temp"),
        weather: document.querySelector("#day4 .weather"),
    },
    day5: {
        dotw: document.querySelector("#day5 .dotw"),
        temp: document.querySelector("#day5 .temp"),
        weather: document.querySelector("#day5 .weather"),
    },
};

searchBarEl.addEventListener("change", function() {
    displayWeatherFor(this.value, function(data) {
        searchBarEl.value = data.city;
        temperatureEl.innerText = `${data.temp.toFixed(1)}°C`;
        weatherDescriptionEl.innerText = `${data.description}`;
    }, function(err) {
        temperatureEl.innerText = `--°C`;
        weatherDescriptionEl.innerText = `--`;
        window.alert(err);
    },);
    displayFiveDayForecast(this.value);
});

// Hide the carousel on page load
carouselEl.style.visibility = "hidden";