//api_address and locator
const API_KEY_WEATHER = '28db2196060bc1b08f6b1d01b5614749';
const URL = "https://api.openweathermap.org/data/2.5/onecall?";
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={YOUR API KEY}
const CITY = 'q=Tokyo';
let LAT = "35.6804";
let LON = "139.769017";
const EXCLUDE = "&exclude=hourly";
const UNIT = "&units=metric";
// let url =  URL + LAT + LON + EXCLUDE + UNIT + '&appid=' + API_KEY_WEATHER ;



/*************************************************************/

let dataBase = { //The API data Generated will be stored here.
  todayForecast: {},
  weeklyForecast: {},
};

console.log("data: ", dataBase);
/*************************************************************/

var weatherAPIDataGenerator = async function(lat, lon) {
  let url = URL + "lat=" + lat + "&lon=" + lon + EXCLUDE + UNIT + '&appid=' + API_KEY_WEATHER;
  const response = await fetch(url);
  const data = await response.json();

  var todayWeather = function() {
    return {
      main: data.current.weather[0].main,
      description: data.current.weather[0].description,
      feels_like: data.current.feels_like,
      humidity: data.current.humidity,
      pressure: data.current.pressure,
      temperature: data.current.temp,
      uvi: data.current.uvi,
      visibility: data.current.visibility,
      wind: data.current.wind_speed,
    }
  };

  var dateConverter = function(th) {
    var date, dayID, dateObject;

    date = new Date(data.daily[th].dt * 1000);
    date = date
      .toString()
      .split(" ")
      .slice(0, 4);

    dayID = {
      Sun: "sunday",
      Sat: "saturday",
      Mon: "monday",
      Tue: "tuesday",
      Wed: "wednesday",
      Thu: "thursday",
      Fri: "friday",
    }

    return {
      days: dayID[date[0]],
      months: date[1],
      dates: date[2],
      years: date[3],
    };

  };

  //var date = new Date(data.daily[0].dt * 1000);
  //{day : dates-months-year, maxTemp: , minTemp: , main: , description: , }

  var APIDataGenerator = function(ith) {

    return {
      date: [dateConverter(ith).days, dateConverter(ith).dates, dateConverter(ith).months, dateConverter(ith).years],
      dt: data.daily[ith].dt,
      maxTemp: data.daily[ith].temp.max,
      minTemp: data.daily[ith].temp.min,
      main: data.daily[ith].weather[0].main, // Just weather[0] according to api data;
      description: data.daily[0].weather[0].description,
    }
  };


  var innerDataBase = {
    // dateConverter(0).days: APIDataGenerator(0),
    // dateConverter(1).days: APIDataGenerator(1),
    // dateConverter(2).days: APIDataGenerator(2),
    // dateConverter(3).days: APIDataGenerator(3),
    // dateConverter(4).days: APIDataGenerator(4),
    // dateConverter(5).days: APIDataGenerator(5),
    // dateConverter(6).days: APIDataGenerator(6),
    // dateConverter(7).days: APIDataGenerator(7),
  };

  (function() {
    for (var i = 0; i < 7; i++) //The array is eight , but only need to forecast for 7 days
      innerDataBase[dateConverter(i).days] = APIDataGenerator(i); //APIDataGenerator(i).date[0]
  })();

  //store formated data into dataBase
  (function() {
    for (var j = 0; j < 7; j++) //The array is eight , but only need to forecast for 7 days
      dataBase.weeklyForecast[dateConverter(j).days] = APIDataGenerator(j); //APIDataGenerator(i).date[0]
  })();


  (function() {
    for (let descriptions of Object.keys(todayWeather())) {
      dataBase.todayForecast[descriptions] = todayWeather()[descriptions]
    }
  })();

};

weatherAPIDataGenerator("35.6804", "139.769017");
//forecastWeather();   ///freakingly important //call this function // else no data will show.

function weather(day) {

  var date, dailyWeather, dailyTemperature, months, dailyForecast, weeklyForecast;

  todayForecast = dataBase.todayForecast;
  weeklyForecast = dataBase.weeklyForecast;

  date = weeklyForecast[day].date;
  dailyWeather = weeklyForecast[day].main;
  dailyTemperature = Math.round(weeklyForecast[day].maxTemp);

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


  document.getElementById("img-weather-icon").src = "./images/" + dailyWeather + ".png";
  document.getElementById("day").textContent = day[0].toUpperCase() + day.slice(1, );
  document.getElementById("date").textContent = date[1] + ' ' + date[2] + ' ' + date[3];
  document.getElementById("weather").textContent = dailyWeather[0].toUpperCase() + dailyWeather.slice(1, );
  document.getElementById("temperature").textContent = dailyTemperature + "°C";
  document.getElementById("weather-display").style.backgroundImage = `url("images/${dailyWeather}.gif")`;
  document.getElementById(day).style.backgroundImage = `url("icons/SVG/${dailyWeather}.svg")`;

  console.log(day, dailyWeather, dailyTemperature);

};


function start() {
  var convertDays, todayDate, todayForecast, weeklyForecast;

  todayForecast = dataBase.todayForecast;
  weeklyForecast = dataBase.weeklyForecast;

  for (let days of Object.keys(dataBase.weeklyForecast)) {
    document.getElementById(days).style.backgroundImage = `url("icons/SVG/${weeklyForecast[days].main}.svg")`;
  };

  dayID = {
    Sun: "sunday",
    Sat: "saturday",
    Mon: "monday",
    Tue: "tuesday",
    Wed: "wednesday",
    Thu: "thursday",
    Fri: "friday",
  }

  todayDate = Date().split(' ')[0];
  weather(dayID[todayDate]);
  document.getElementById(dayID[todayDate]).textContent = "Today";
  document.getElementById(dayID[todayDate]).style.boxShadow = "0px 0px 3px 3px #0ff";
  document.getElementById("img-weather-icon").onclick = function() {};

  //show daily weather data
  console.log(todayForecast.main)


  var time = Date()
    .split(' ')[4]
    .split(':')
    .slice(0, 2)
    .join(":");


  var showCurrentWeather = function(selectorID) {

    var html, city;

    var inputAddress = document.getElementById("location-input").value;
    city = inputAddress == '' ? "Tokyo" : inputAddress;
    city = city[0].toUpperCase() + city.slice(1, );
    console.log(city);
    html = '<p1 id="today-weather-city">' + city + '</p1> ' +
      '<p1 id="today-weather-time">' + time + '</p1> </br> ' +
      '<p1 id="today-weather-temp">' + Math.round(todayForecast.temperature) + '°C' + '</p1> ' +


      '<img src="images/currentWeatherIcons/' + todayForecast.main + '.png"' + 'id="main-weather-icon" alt="sorry"></img></br>' +

      '<p1 id="today-weather-main">' + todayForecast.main + '</p1>' +
      '<p1 id="today-weather-description"> (' + todayForecast.description + ')</p1> &nbsp; </br></br>' +
      // '<p1 id="today-weather-city">' + city + '</p1></br>' +


      '<p1 id="today-weather-note">' + "<em>&#9788;</em> Hourly updated data <em>&#9788;</em>" + '</p1>';



    var element = document.getElementById(selectorID);
    element.innerHTML = html;
  };

  showCurrentWeather('current-weather-info');

  var showDetailWeather = function(selectorID) {

    var html;

    // description: "light intensity shower rain"
    // feels_like: 27.24
    // humidity: 83
    // main: "Rain"
    // pressure: 1009
    // temperature: 26.26
    // uvi: 11.56
    // visibility: 10000

    html = '<img id="weather-assets-icons" src="icons/SVG/weatherAssets/' + 'wind.svg"> &nbsp; &nbsp; &nbsp; ' +
      '<img id="weather-assets-icons" src="icons/SVG/weatherAssets/' + 'humidity.svg"> &nbsp; &nbsp; &nbsp; ' +
      '<img id="weather-assets-icons" src="icons/SVG/weatherAssets/' + 'UVI.svg"> </br>' +
      '<p1 id="weather-assets-data">' + Math.round(todayForecast.wind * 10) / 10 + ' m/s </p1>' + ' &thinsp; &thinsp;   ' +
      '<p1 id="weather-assets-data">' + todayForecast.humidity + '% </p1>' + '&thinsp; &emsp; &ensp; ' +
      '<p1 id="weather-assets-data">' + Math.round(todayForecast.uvi) + '</p1>'


    var elements = document.getElementById(selectorID);
    elements.innerHTML = html;

  };

  showDetailWeather('detail-weather-info');

  var showSuggestedItems = function(selectorID) {

    var rainSuggestionHTML, sunnySuggestionHTML, snowySuggestionHTML;

    rainSuggestionHTML = '<p1 id="">' + "There is chance of Rain today. You should bring the following itmes before going out." + '</p1> </br>' +
      '<img id="suggested-items-icons" src="icons/SVG/RainyDayItems/' + 'raincoat.svg">' +
      '<img id="suggested-items-icons" src="icons/SVG/RainyDayItems/' + 'umbrella.svg" >' + '&nbsp;' +
      '<img id="suggested-items-icons" src="icons/SVG/RainyDayItems/' + 'boots.svg" >';


    sunnySuggestionHTML = '<p1 id="">' + "Today will be a Sunny day. You should bring the following items before leaving home." + '</p1> </br>' +
      '<img id="suggested-items-icons" src="icons/SVG/SunnyDayItems/' + 'waterbottle.svg">' + '&nbsp;' +
      '<img id="suggested-items-icons" src="icons/SVG/SunnyDayItems/' + 'coolshirt.svg" >' + '&nbsp;' +
      '<img id="suggested-items-icons" src="icons/SVG/SunnyDayItems/' + 'cap.svg" >' + '&nbsp;';

    snowySuggestionHTML = '<p1 id="">' + "Today will be a Cold day. You should bring the following itmes before you go out." + '</p1> </br>' +
      '<img id="suggested-items-icons" src="icons/SVG/SnowyDayItems/' + 'warmcloth.svg">' + '&nbsp;' +
      '<img id="suggested-items-icons" src="icons/SVG/SnowyDayItems/' + 'glove.svg" >' + '&nbsp;' +
      '<img id="suggested-items-icons" src="icons/SVG/SnowyDayItems/' + 'beanie.svg" >' + '&nbsp;';

    cloudySuggestionHTML = '<p1 id="">' + "Today will be a Cloudy day. There is no specific suggestions for today." + '</p1> </br> </br>' +
      '<p1 id="" style="color:white">' + "- It is a suitable weather to go for a walk around the city." + '</p1>';


    var suggestions = {
      Rain: rainSuggestionHTML,
      Clear: sunnySuggestionHTML,
      Clouds: cloudySuggestionHTML,
      Snow: snowySuggestionHTML,
    };



    var elements = document.getElementById(selectorID);
    elements.innerHTML = suggestions[weeklyForecast[dayID[todayDate]].main];

  };

  showSuggestedItems('suggested-items-info');


  var addRequestIcon = function(selectorID) {
    var img = document.createElement("IMG");
    img.setAttribute("src", "icons/sorry.png");
    img.setAttribute("alt", "sorry");
    img.setAttribute("id", "request-emoji-icon");
    document.querySelector(selectorID).appendChild(img);
  };

  // addRequestIcon("#img-grid-1");
  // addRequestIcon("#img-grid-2");
  // addRequestIcon("#img-grid-3");


  var addErrorMessage = function(selectorID) {
    var p1 = document.createElement("p1");
    var node = document.createTextNode("Sorry! The data is not available yet.");
    p1.appendChild(node);
    document.querySelector(selectorID).appendChild(p1);
  }

  // [".grid-1", ".grid-2", ".grid-3"].map(id => addErrorMessage(id));
  //addErrorMessage("#img-grid-1");
  //addErrorMessage("#img-grid-2");
  //addErrorMessage("#img-grid-3");

  console.log("application started.");
  addFeature();
};



var API_KEY_GOOGLE = 'AIzaSyCQmcTCoxvxXpPHWwYQJG04bLkmtjbySjU';

function callGeocodingAPI(address, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) {
      return;
    }
    if (xhr.status == 200) {
      var data = JSON.parse(xhr.responseText);
      if (data.results.length > 0) {
        var location = data.results[0].geometry.location;
        callback(location);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  };
  xhr.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + API_KEY_GOOGLE);
  xhr.send();
}

var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 35.7804643,
      lng: 139.7151025
    },
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
  });
}

function findWeather() {
  // 1. Try to retrieve latitude and longitude from address by using Geocoding API.
  // When the coorinate is retrieved, displayCoordinate should be called.
  var inputAddress;
  inputAddress = document.getElementById('location-input').value;
  //inputAddress = inputAddress.value[0].toUpperCase() + inputAddress.value.slice(1,);

  callGeocodingAPI(inputAddress, getCoordinate);
  setTimeout(start, 1000);

  setTimeout(start, 1500);
  // setTimeout(start, 1000);

};



// setTimeout(findWeather, 1000);

function getCoordinate(result) {

  if (result == null) {
    return;
  }

  //callWeatherAPI(Number(result.lat), Number(result.lng), displayWeather);

  weatherAPIDataGenerator(result.lat, result.lng);
  map.setCenter({
    lat: Number(result.lat),
    lng: Number(result.lng)
  });

  console.log(Number(result.lat), Number(result.lng))
};

function displayWeather(result) {
  // 5. Display the weather.
  let LAT = "lat=" + result.lat;
  let LON = "&lon=" + result.lon;
  // weatherAPIDataGenerator(LAT, LON);
};


function addFeature() {

  //innerAdjacementHTML test
  // var feature = '<div class="row"> <div class="col border border-success-5 grid-4" id="img-grid-3"><h3> Suggested items</h3> <br><img src="icons/sorry.png" id="request-emoji-icon" alt="sorry"><p1>Sorry! This features is not available yet.</p1></div></div>'
  // document.querySelector("#newFeatures-display").insertAdjacentHTML('beforebegin', feature);

  // Get the modal

}


function submit() {

  document.getElementById("featureModal").style.display = "none";

  var showFeature = function(checkboxID, featureID) {
    var checkbox = document.getElementById(checkboxID);
    var feature = document.getElementById(featureID);
    if (checkbox.checked) {
      feature.style['display'] = 'block';
    } else {
      feature.style['display'] = 'none';
    }
  };

  // showFeature('todaysWeather', 'img-grid-5');
  showFeature('whu', 'img-grid-2');
  showFeature('suggestions', 'img-grid-7');



  // var checkbox = document.getElementById('checkbox');
  // var box = document.getElementById('box');
  // checkbox.onclick = function() {
  //   console.log(this);
  //   if (this.checked) {
  //     box.style['display'] = 'block';
  //   } else {
  //     box.style['display'] = 'none';
  //   }
  // };

  //
  // var checks = {
  //   todaysWeather: elmDailyWeather,
  //   whu: elmUVIndex,
  //   suggestions: elmSuggestions,
  // };

  //To get the checked feature lists.
  var checkedFeatures = [];
  var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
  for (var i = 0; i < checkboxes.length; i++) {
    if (!(checkboxes[i].value in checkedFeatures)) {
      checkedFeatures.push(checkboxes[i].value);
    }
  };


};


// function cancel() {
//   checkbox.onclick = function() {
//       console.log(this);
//       if (this.checked) {
//           box.style['display'] = 'block';
//       } else {
//           box.style['display'] = 'none';
//       }
//   };
//   var modal = document.getElementById("featureModal");
//
//     modal.style.display = "none";
//
// };


function remove() {
  //var removeFeature = document.getElementsByClassName("close");
  //  var feature   = document.getElementById("img-grid-3");
  //remove.onclick = function() {
  document.getElementById("img-grid-5").style.display = "none";
  console.log("deleted")
}


var test1 = function() {
  var f1 = document.getElementById("todaysWeather")
  f1.click(function() {
    if (f1.checked) {
      f1.style.display = "block";
      console.log("clicked");
    } else {
      f1.style.display = "none";
    }
  });
};






// document.querySelector("remove").style.display = none;
// function UIController() {
//   document.querySelector("remove").style.display = none;
// }







//More secure Codes for further developements

//data and other control
// var weatherController = (function () {
//   let dataBase = {
//       monday : {20200603 : ['cloudy'], },
//       tuesday : {20200604 : ['sunny'], },
//       wednesday : {20200605 :  ['sunny'], },
//       thursday : {20200606 : ['rainy'], },
//       friday : {20200607 : ['cloudy'], },
//       saturday : {20200608 :  ['sunny'], },
//       sunday : {20200609 :  ['rainy'], },
//   };
//
//   return {
//           data: dataBase,
//   }
//
// })();
//
//
//
// //UI controller
//
// var UIController = (function() {
//
//   var DOMStrings  = {
//     monday: '#monday',
//     tuesday: '#tuesday',
//     wednesday: '#wednesday',
//     thursday: '#thursday',
//     friday: '#friday',
//     saturday: '#saturday',
//     sunday: '#sunday',
//
//   };
//
//
//
//   return {
//
//
//
//     getDomStrings : function() {
//       return DOMStrings
//     }
//   }
//
// })();
//
//
//
//
// //Controller
// var controller = (function(weatherCtrl, UICtrl) {
//
//   var setButton = function() {
//     var DOMStr = UICtrl.getDomStrings();
//     document.querySelector(DOMStr.monday).addEventListener('click', function() {
//       document.querySelector(DOMStr.monday).src = "./image/" + "cloudy.png";
//     })
//   }
//
//
//   var weatherInfo  = weatherCtrl.data;
//
//
//
//
//  // weatherInfo.monday, weatherInfo.tuesday, etc // data extraction
//    var monday = function () {
//      document.querySelector(DOMStr.monday).src = "./image/" + "cloudy.png";
//    };
//
//
//   return {
//     init : function() {
//
//       setButton()
//       console.log("Application started", )
//     },
//
//     }
//
//   }
// })(weatherController, UIController);
//
// controller.init();







// function weather() {
//
//   var setEventListener = function() {
//     let day = document.getElementById("monday").value
//
//   if (day == 'monday') {
//   document.getElementById("img").src = "./images/cloudy.png";
//   }
//
// }

// document.getElementById("weatherID").addEventListener('click ', function(){
//     var d = document.getElementById("weatherId").value;
//     w(d);
//   };
// )
