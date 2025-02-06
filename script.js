const OPENWEATHER_API_KEY = "a1e0f54713be1d1d848f352296f8aaa7";

<<<<<<< HEAD
        function getLatitudeLongitude(placeName, onSuccess, onError) {
            const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${placeName}&limit=3&appid=${OPENWEATHER_API_KEY}`;

            fetch(apiUrl)
                .then((resp) => {
                    if(!resp.ok) {
                        onError("couldn't fetch weather information");
                        return;
                    }
                    return resp.json();
                }).then((data) => {
                    if (!data || data.length === 0) {
                        onError("no data");
                        return;
                    }

                    onSuccess({ lon: data[0].lon, lat: data[0].lat });
                }).catch((err) => onError(err));
        }

        /*
            geolocation - An object with floating point "lon" and "lat" values.
        */
        function getWeatherInfo(geolocation, onSuccess, onError, useCelsius = true) {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${geolocation.lat}&lon=${geolocation.lon}&units=${useCelsius ? "metric" : "imperial"}&appid=${OPENWEATHER_API_KEY}`
            fetch(apiUrl)
                .then((resp) => {
                    if(!resp.ok) {
                        onError("couldn't fetch weather information");
                        return;
                    }
                    return resp.json();
                }).then((data) => {
                    onSuccess({ city: data.name, temp: data.main.temp, description: data.weather[0].description });
                }).catch((err) => onError(err));
        }
=======
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
>>>>>>> a1675c047420687cfe5d714ea7b1da4a025a1a15

        const searchBarEl = document.getElementById("search-bar");
        const temperatureEl = document.getElementById("current-weather");
        const weatherDescriptionEl = document.getElementById("weather-description");
        const errorBanner = document.getElementById("error-banner");

<<<<<<< HEAD
        searchBarEl.addEventListener("change", function() {
            getLatitudeLongitude(this.value, function(geolocation) {
                getWeatherInfo(geolocation, function(data) {
                    searchBarEl.value = data.city;
                    temperatureEl.innerText = `Temperature: ${data.temp}°C`;
                    weatherDescriptionEl.innerText = `Weather: ${data.description}`;
                }, function(errorMessage) {
                    errorBanner.style.display = 'block';
                    errorBanner.innerText = `Error: ${errorMessage}`;
                });
            }, function(errorMessage) {
                errorBanner.style.display = 'block';
                errorBanner.innerText = `Error: ${errorMessage}`;
            });
        });

        window.onerror = function(message, source, lineno, colno, error) {
            errorBanner.style.display = 'block';
            errorBanner.textContent = `Error: ${message} at ${source}:${lineno}:${colno}`;
            return true; 
        };
        function closeErrorBanner() {
            errorBanner.style.display = 'none';
        };

        errorBanner.addEventListener("click", closeErrorBanner);
=======
searchBarEl.addEventListener("change", function() {
    displayWeatherFor(this.value, function(data) {
        searchBarEl.value = data.city;
        temperatureEl.innerText = `${data.temp.toFixed(1)}°C`;
        weatherDescriptionEl.innerText = `${data.description}`;
    }, window.alert);
});
