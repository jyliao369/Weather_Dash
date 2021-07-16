// use this APi to look up information on the weather based on cities
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
var city =  document.getElementById('city');
var mainTemp = document.getElementById('temp');
var windSP = document.getElementById('wind');
var humiditiyEl = document.getElementById('humid');
var uvIndex = document.getElementById('UV');

var submitEl = $('#submitBtn');
var searchCity = $('#citySearch');
var forecastList = $('#forecast');

var APIkey = "7cc7829433b8a41fdd51019abc0a8412";
var cityName = "";
var forecast = [];

// This function should get the current weather information for the current day
function getWeatherInfo() {

    var mainURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
    
    fetch(mainURL)
        
        .then(function (response) {
            return response.json();
        })

        .then(function(data) {
            console.log(data);

            city.textContent = data.name;
            mainTemp.textContent = data.main.temp;
            windSP.textContent = data.wind.speed;
            humiditiyEl.textContent = data.main.humidity;
            
            var latEl = data.coord.lat;
            var lonEl = data.coord.lon;

            // console.log(latEl);
            // console.log(lonEl);

            var UVurl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latEl + "&lon=" + lonEl + "&exclude=hourly,daily&appid=" + APIkey;

            fetch(UVurl)

            .then(function (response) {
                return response.json();
            })

            .then(function (data) {
                // console.log(data);
                // console.log(data.current.uvi);
                uvIndex.textContent = data.current.uvi;
            });
        });
    
}

// This functiuon should get the 5 day forecast
function getForecast() {
    
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIkey;

    fetch(forecastURL)

        .then(function (response) {
            return response.json();
        })

        .then(function (data) {

            console.log(data);
            var b = 4;

            for (var a = 0; a < 5; a++){

                var dateValue = data.list[b].dt_txt;
                var dateTemp = data.list[b].main.temp;
                var dateWind = data.list[b].wind.speed;
                var dateHumid = data.list[b].main.humidity;

                forecastList.append('<li>' + dateValue + '</li>');
                forecastList.append('<li>' + dateTemp + '</li>');
                forecastList.append('<li>' + dateWind + '</li>');
                forecastList.append('<li>' + dateHumid + '</li>');
    
                // console.log(dateValue);
                // console.log("Temp " + dateTemp);
                // console.log("Wind Speed " + dateWind);
                // console.log("Humidity " + dateHumid);

                b += 8;

            }
        });
}

// this function will display the five day forecast





// This even function should take what ever city that is put in the search input
// and used that to generate the current weather for that location.
submitEl.on('click', function() {
    event.preventDefault();

    if (searchCity.val() === ""){
        console.log("Please input a city"); 
    } else {
        console.log(searchCity.val());
        cityName = searchCity.val();
        getWeatherInfo();
        getForecast();
    }
});





