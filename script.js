// variables that need to be global
var searches = [];
var lon;
var lat;
var userInput;
// fetch time object from luxon
var time = luxon.DateTime.local();
// fetches all previous searches and places them on page
init();

// when button is pushed
$("#searchBtn").on("click", function () {
    // clear previous search
    clear();
    // fetch user input
    userInput = $("#input").val().trim();
    if (userInput === "") {
        return;
    }

    // save user input into array of searches
    searches.push(userInput);
    $("#input").val("");

    //  put all searched items from local storage in .search
    storeSearches();
    //  save into local storage (set)
    renderSearches();
    // put weather data into correct slots
    getWeather();
});

// when user clicks on a previous search, that city will be searched again
$("#searches").delegate(".prevSearchBtn", "click", function () {
    // clear previous search
    clear();
    // fetch previously searched city
    userInput = $(this).text();
    if (userInput === "") {
        return;
    }

    // save user input into array of searches
    searches.push(userInput);
    $("#input").val("");


    // put weather data into correct slots
    getWeather();
    //  put all searched items from local storage in .search
    storeSearches();
    //  save into local storage (set)
    renderSearches();
})

function getWeather() {
    // create variable named city that is equal to user input
    var city = userInput;
    // create variable named queryURL that is equal to the open weather map URL
    //      replace the city name to the variable named city
    var locationURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=09746f545308cabfeaaf4a81e5a0da1d`
    // use AJAX to retrieve open weather map object for longitude and latitude
    $.ajax({
        url: locationURL,
        method: "GET"
    }).then(function (result) {
        // console.log(result)
        //  replace text of #city with results.data.city
        $("#city").text(result.name)

        lat = result.coord.lat;
        lon = result.coord.lon;
        // console.log(lat)
        // console.log(lon)
        // use another Ajax to retrieve open weather map object for all data
        var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=09746f545308cabfeaaf4a81e5a0da1d`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            //      TODO: replace text of #todaysDate with results.data.date

            var zone = luxon.DateTime.local().setZone(response.timezone)

            $("#todaysDate").text(`(${zone.month}/${zone.day}/${zone.year})`)

            //       replace attribute of #todaysIcon with results.data.icon
            $("#todayIcon").attr("src", `http://openweathermap.org/img/wn/${response.current.weather[0].icon}.png`);

            //  replace text of #temperature with results.data.temperature
            $("#temperature").text("Temperature: " + response.current.temp + " °F");
            //  replace text of #humidity with results.data.humidity
            $("#humidity").text("Humidity: " + response.current.humidity + "%");
            //  replace text of #windspeed with results.data.windspeed
            $("#windspeed").text("Windspeed: " + response.current.wind_speed + " MPH");
            //  replace text of #UVindex with results.data.uvindex
            var UVindex = response.current.uvi;

            $("#UVindex").text("UV Index: " + UVindex);
            //      change UVindex background based on the results
            //          if UVindex is less than 3, then set background color to green
            if (UVindex < 3) {
                $("#UVindex").css("background-color", "green");
            }
            //          if UVindex is greater than or equal to 6, then set background color to red
            else if (UVindex >= 6) {
                $("#UVindex").css("background-color", "red");
            }
            //          if UVindex is greater than or equal to 3 and less than 6, then set background color to yellow
            else {
                $("UVindex").css("background-color", "yellow");
            }

            $("#forecast").text("");
            // create title for forecast and put on page
            $("#forecastTitle").attr("style", "display: block")
            //      the for loop should loop 5 times, each time producing the next day and placing the data into a different slot in the forecast area
            for (var i = 1; i < 6; i++) {
                var div = $("<div>");
                div.addClass("col-2 bg-primary rounded justify-content-evenly forecastDay");
                $("#forecast").append(div);

                //    replace text of .date with results.data.date

                var nextDay = zone.plus({ hours: 24 * i })

                var date = $("<p>");
                date.text(`${nextDay.month}/${nextDay.day}/${nextDay.year}`);
                date.addClass("dateText")
                div.append(date);

                //    replace text of .icon with results.data.icon
                var icon = $("<img>");
                icon.attr("src", `http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}.png`);
                div.append(icon);

                //    replace text of .temperature with results.data.temperature
                var temp = $("<p>");
                temp.text("Temp: " + response.daily[i].temp.day + " °F");
                div.append(temp);

                //    replace text of .humidity with resulst.data.humidity
                var humidity = $("<p>");
                humidity.text("Humidity: " + response.daily[i].humidity + "%");
                div.append(humidity);
            }

        })
    });
}



function renderSearches() {
    $("#searches").html("");

    for (var i = 0; i < searches.length; i++) {
        var search = searches[i];

        var button = $("<button>");
        button.text(search);
        button.attr("data-index", i);
        button.addClass("border");
        button.addClass("rounded");
        button.addClass("prevSearchBtn")

        $("#searches").prepend(button)

    }

}

function init() {
    var prevSearches = JSON.parse(localStorage.getItem("searches"));

    if (prevSearches !== null) {
        searches = prevSearches;
        userInput = searches[searches.length - 1]
    }

    renderSearches();
    getWeather()
}

function storeSearches() {
    localStorage.setItem("searches", JSON.stringify(searches));
}

function clear () {
    $("#city").text("");
    $("#todayIcon").text("");
    $("#temperature").text("");
    $("#humidity").text("");
    $("#windspeed").text("");
    $("#UVindex").text("");
}