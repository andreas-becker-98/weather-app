const OPENWEATHER_API_KEY = "a1e0f54713be1d1d848f352296f8aaa7";

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

const searchBarEl = document.getElementById("search-bar");
const temperatureEl = document.getElementById("current-weather");
const weatherDescriptionEl = document.getElementById("weather-description");

searchBarEl.addEventListener("change", function() {
    displayWeatherFor(this.value, function(data) {
        searchBarEl.value = data.city;
        temperatureEl.innerText = `${data.temp.toFixed(1)}°C`;
        weatherDescriptionEl.innerText = `${data.description}`;
    }, window.alert);
});