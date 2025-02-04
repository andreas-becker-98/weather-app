const OPENWEATHER_API_KEY = "a1e0f54713be1d1d848f352296f8aaa7";

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



// TESTING
getLatitudeLongitude("mexico", function(geolocation) {
    getWeatherInfo(geolocation, console.log);
});
