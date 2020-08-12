var d = new Date();
var dateText = document.querySelector("#date");
var eventsText = document.querySelector("#events");
var locationText = document.querySelector("#location");
var weatherStats = document.querySelector("#stats");
var pos;

window.onload = function() {
    setDate();
    getEvent();
    getPost();
};

function getPost(){
    const url = 'https://www.reddit.com/r/wallpapers/top/.json';
    $.get(url, function(data, status){
        getBackground(data);
    })
}

function getBackground(data){
    const bgPath = data.data.children[0].data.url;
    document.querySelector('html').style.backgroundImage = "url(" + bgPath + ")";
}

function getEvent(){
    const url='https://www.googleapis.com/calendar/v3/calendars/[yourcalendar]'
    $.get(url, function(data, status){
        nextEvent(data.items)
    })
}

function nextEvent(data){
    var i = 0;
    var events = [];
    var eSort = [];
    // console.log(data);
    data.forEach(element => {
        for(key in element.start){
            var strDate = (element.start[key]);
            var eDate = strDate.split("-",3);
            var eYear = parseInt(eDate[0]);
            var eMonth = parseInt(eDate[1]);
            var eDay = parseInt(eDate[2].split("T",1));
            if(eYear >= d.getFullYear() ){
                if(eMonth == (d.getMonth()+1) && eDay >= d.getDate() || eMonth > (d.getMonth()+1)){
                    eSort.push([eDay, eMonth, eYear, element.summary]);
                    i++;
                }
            }
            switch(element.start){
                default: 
                    return "no date found"
            }
        }
    });
    sortEvent(eSort);
    for(i = 0; i < eSort.length; i++){
        eventsText.innerHTML += 
            "<li>" + 
                "<h2>" + eSort[i][3] + "</h2>" +            
                "<p>" + eSort[i][0] + "/" + eSort[i][1] + "/" + eSort[i][2] + "</p>" +
            "</li>"
    }
   
}

function sortEvent(e, elements){
    for(i = 0; i < e.length-1; i++){
        for(j = i+1; j < e.length; j++){
            if(e[i][0] > e[j][0]){
                var tmp = e[i];
                e[i] = e[j];
                e[j] = tmp;
            }
        }
    }
    // console.log("before: " + elements)
    for(i = 0; i < e.length-1; i++){
        for(j = i+1; j < e.length; j++){
            if(e[i][1] > e[j][1]){
                var tmp = e[i];
                e[i] = e[j];
                e[j] = tmp;
            }
        }
    }
    // console.log("after: " + elements)
    for(i = 0; i < e.length-1; i++){
        for(j = i+1; j < e.length; j++){
            if(e[i][2] > e[j][2]){
                var tmp = e[i];
                e[i] = e[j];
                e[j] = tmp;
            }
        }
    }
}

function getWeather(loc){
    console.log(loc[2].long_name);
    const url='https://api.openweathermap.org/data/2.5/forecast?q=' + loc[2].long_name + '[openweathermapAPI]'
    $.get(url, function(data, status){
        calcWeather(data.list[0]);
    })
}

function calcWeather(data){
    var element = document.createElement("i");
    element.classList.add("owf", "owf-" + data.weather[0].id);
    locationText.prepend(element);
    weatherStats.innerHTML += 
    "<h3>" + data.weather[0].description + "</h3>" +            
    "<li>" + 
    "<h2> Temperature </h2>" +
    "<p>" + data.main.temp + "°c</p>" +            
    "</li>" +
    "<li>" + 
    "<h2> Wind </h2>" +
    "<p>" + data.wind.speed + "m/s " + Math.round(data.wind.deg) + "° (" + winddegToDir(data.wind.deg) + ")</p>" +            
    "</li>"
    // console.log(data);
}

// function initMap() {
    //     formatLocation("Aalborg");
    // }
    function getPosSuccess(position){
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        var geocoder = new google.maps.Geocoder();
        geocodeLatLng(geocoder);
    };
    
    function getPosFail(e){
        console.log(e);
    }
    
    function initMap() {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getPosSuccess, getPosFail);
        }   
    }
    
    function geocodeLatLng(geocoder) {
        var latlng = {lat: pos.lat, lng: pos.lng}
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
                console.log(results);
                formatLocation(results[0].address_components);
                // console.log(results[0]);
                if (!results[0]) {
                    window.alert('No results found');
                } 
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }
    
    function formatLocation(location){
        locationText.innerHTML = location[location.length-3].long_name + ", " + location[location.length-2].short_name;
        // locationText.innerHTML = location + ", DK";
        getWeather(location);
    }

function  winddegToDir(degree){
    if (degree>337.5) return 'Northerly';
    if (degree>292.5) return 'North Westerly';
    if(degree>247.5) return 'Westerly';
    if(degree>202.5) return 'South Westerly';
    if(degree>157.5) return 'Southerly';
    if(degree>122.5) return 'South Easterly';
    if(degree>67.5) return 'Easterly';
    if(degree>22.5){return 'North Easterly';}
    return 'Northerly';
}

function setDate(){
    var day = numberToDay(d.getDay());
    var date = d.getDate();
    var month = numberToMonth(d.getMonth());
    var year = d.getFullYear();
    dateText.innerHTML = day + " " + date + " " + month + " " + year;
}

function numberToDay(i){
    switch(i){
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "Whattheheck";
    }
}

function numberToMonth(i){
    switch(i){
        case 0:
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        case 11:
            return "December";
        default:
            return "No month";
    }
}