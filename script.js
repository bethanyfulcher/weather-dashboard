var searches = [];

// fetches all previous searches and places them on page
init();

// when button is pushed
$("#searchBtn").on("click", function() {
    console.log("clicked search");
    // fetch user input
    var userInput = $("#input").val().trim();
    console.log(userInput);
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

    
    // create variable named city that is equal to user input
    var city = userInput;
    // create variable named queryURL that is equal to the open weather map URL
    //      replace the city name to the variable named city
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${ city }&appid=09746f545308cabfeaaf4a81e5a0da1d
    `
    // TODO: use AJAX to retrieve open weather map object for today's date
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(result) {
        console.log(result)
    });
    //  TODO: replace text of #city with results.data.city
    //      TODO: replace text of #todaysDate with results.data.date
    //      TODO: replace text of #todaysIcon with results.data.icon
//  TODO: replace text of #temperature with results.data.temperature
//  TODO: replace text of #humidity with results.data.humidity
//  TODO: replace text of #windspeed with results.data.windspeed
//  TODO: replace text of #UVindex with results.data.uvindex
//      TODO: change UVindex background based on the results
//          TODO: if UVindex is less than 3, then set background color to green
//          TODO: if UVindex is greater than or equal to 3 and less than 6, then set background color to yellow
//          TODO: if UVindex is greater than or equal to 6, then set background color to red


//  TODO: within another AJAX, retrieve open weather map object for the next five days
//      TODO: do this by placing the AJAX inside a for loop
//      TODO: the for loop should loop 5 times, each time producing the next day and placing the data into a different slot in the forecast area
//    TODO: find element with value of i
//    TODO: replace text of .date with results.data.date
//    TODO: replace text of .icon with results.data.icon
//    TODO: replace text of .temperature with results.data.temperature
//    TODO: replace text of .humidity with resulst.data.humidity

});

function renderSearches() {
    $("#searches").html("");

    for (var i = 0; i < searches.length; i++)
    {
        var search = searches[i];

        var li = $("<li>");
        li.text(search);
        li.attr("data-index", i);
        li.addClass("border")
        li.addClass("rounded")

        $("#searches").prepend(li)
        
    }

}

function init () {
    var prevSearches = JSON.parse(localStorage.getItem("searches"));
    
    if (prevSearches !== null) {
        searches = prevSearches;
    }

    renderSearches();
}

function storeSearches() {
    localStorage.setItem("searches", JSON.stringify(searches));
}