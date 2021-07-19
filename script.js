// use this APi to look up information on the weather based on cities
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
var city =  document.getElementById('city');
var mainTemp = document.getElementById('temp');
var windSP = document.getElementById('wind');
var humiditiyEl = document.getElementById('humid');
var uvIndex = document.getElementById('UV');

var submitEl = $('#submitBtn');
var searchCity = $('#citySearch');
var pastCities = $('#pastcities');

// Icon images
var cloudyImg = document.getElementById('cloudImg');
var mistyImg = document.getElementById('mistImg');
var rainyImg = document.getElementById('rainImg');
var sunnyImg = document.getElementById('sunImg');
var stormyImg = document.getElementById('stormImg');

var APIkey = "7cc7829433b8a41fdd51019abc0a8412";
var cityName = "";

var forID = ["#forecast1","#forecast2","#forecast3","#forecast4","#forecast5"];
var dateID = ["#date1","#date2","#date3","#date4","#date5"];
var tempID = ["#temp1","#temp2","#temp3","#temp4","#temp5"];
var windID = ["#wind1","#wind2","#wind3","#wind4","#wind5"];
var humID = ["#hudmity1","#hudmity2","#hudmity3","#hudmity4","#hudmity5"];
var iconID = ["#icon1","#icon2","#icon3","#icon4","#icon5"];

var citylimit = 0;
var lastcity = [];
var start = 0;
var length = 0;
var img ="";

// This function should get the current weather information for the current day
// it should also create a list of past searched cities
function getWeatherInfo() {

    var mainURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
    
    fetch(mainURL)
        
        .then(function (response) {
            return response.json();
        })

        .then(function(data) {
            console.log(data);

            console.log("testing 1 " + data.weather[0].main);

            city.textContent = data.name;
            mainTemp.textContent = data.main.temp;
            windSP.textContent = data.wind.speed;
            humiditiyEl.textContent = data.main.humidity;
            
            var latEl = data.coord.lat;
            var lonEl = data.coord.lon;

            if(data.weather[0].main === "Clouds") {

                stormyImg.style.display = "block";

                sunnyImg.style.display = "none";
                mistyImg.style.display = "none";
                rainyImg.style.display = "none";

            } 
            else if (data.weather[0].main === "Clear") {

                sunnyImg.style.display = "block";

                mistyImg.style.display = "none";
                rainyImg.style.display = "none";
                stormyImg.style.display = "none";

            } else if (data.weather[0].main === "Mist" || data.weather[0].main === "Haze") {
                
                mistyImg.style.display = "block";

                rainyImg.style.display = "none";
                stormyImg.style.display = "none";
                sunnyImg.style.display = "none";

            } else if (data.weather[0].main === "Rain") {

                rainyImg.style.display = "block";

                stormyImg.style.display = "none";
                sunnyImg.style.display = "none";
                mistyImg.style.display = "none";
            }

            // This Url and everything after is mostly used for looking up the UV index
            var UVurl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latEl + "&lon=" + lonEl + "&exclude=hourly,daily&appid=" + APIkey;

            fetch(UVurl)

            .then(function (response) {
                return response.json();
            })

            .then(function (data) {

                // This if statment should print UV INDEX color to match
                // Green is least severe with the darkorchid the most severe
                if(data.current.uvi <= 2){
                    uvIndex.textContent = data.current.uvi;
                    $("#UV").css("color", "greenyellow");
                } else if (data.current.uvi > 2  && data.current.uvi <= 5){
                    uvIndex.textContent = data.current.uvi;
                    $("#UV").css("color", "gold");
                } else if (data.current.uvi > 5 && data.current.uvi <= 8){
                    uvIndex.textContent = data.current.uvi;
                    $("#UV").css("color", "coral");
                } else if (data.current.uvi > 7 && data.current.uvi <= 11){
                    uvIndex.textContent = data.current.uvi;
                    $("#UV").css("color", "crimson");
                } else {
                    uvIndex.textContent = data.current.uvi;
                    $("#UV").css("color", "darkorchid");
                }
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
                
                var date = document.querySelector(dateID[a]);
                var temp = document.querySelector(tempID[a]);
                var wind = document.querySelector(windID[a]);
                var humid = document.querySelector(humID[a]);
                var iconsID = document.querySelector(iconID[a]);

                var weather = data.list[b].weather[0].main;

                console.log("weather " + weather);

                date.textContent = data.list[b].dt_txt;
                temp.textContent = data.list[b].main.temp + "°K";
                wind.textContent = data.list[b].wind.speed + " mph";
                humid.textContent = data.list[b].main.humidity + "%";

                b += 8;

                // These line of codes will show the icon of the weather
                // The logic goes that it will cycle through each day.

                if(weather === "Clouds") {

                    iconsID.textContent = "☁️";
    
                } else if (weather === "Clear") {

                    iconsID.textContent = "☀️";
    
                } else if (weather === "Mist" || weather === "Haze") {

                    iconsID.textContent = "🌫️";
    
                } else if (weather === "Rain") {

                    iconsID.textContent = "☔";

                }

            }
            
            a = 0;
        });
}

// This function is to help generate a list of past cities
function displayCityList() {

    $('<button value = "' + cityName + '" id = "pastcities" class = "newElement' + citylimit + '">' + cityName + '</button>').prependTo($('#pastcities'));

    if (citylimit > 10) {
        $(".newElement" + start).remove();
        start++;
    }
}

// This even function should take what ever city that is put in the search input
// and used that to generate the current weather for that location.
submitEl.on('click', function() {
    event.preventDefault();

    if (searchCity.val() === ""){
        console.log("Please input a city");
    } else {
        console.log(searchCity.val());
        cityName = searchCity.val();

        displayCityList()
        getWeatherInfo();
        getForecast();
        
    }
});

pastCities.on('click', function() {
    event.preventDefault();

    var test = $(this).text();

    var length = cityName.length;

    console.log("how long the wrod is " + length);
    console.log(test.slice(0,9));

})

