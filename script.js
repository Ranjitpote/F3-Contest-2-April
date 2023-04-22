
    var x = document.getElementById("latitude");
    var y = document.getElementById("longitude");
    var mapDiv = document.getElementById("map");
    var weatherDataDiv = document.getElementById("weather-data");

    var map = null;
        var lat = null;
        var lon = null;

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
    }

    function showPosition(position) {
      x.innerHTML = "Latitude: " + position.coords.latitude;
      y.innerHTML = "Longitude: " + position.coords.longitude;

      // Create the map centered on the user's current location
      var map = new google.maps.Map(mapDiv, {
        center: { lat: position.coords.latitude, lng: position.coords.longitude },
        zoom: 8
      });

      // Call the OpenWeatherMap API to get the weather data
      fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=YOUR_API_KEY&units=metric")
        .then(response => response.json())
        .then(data => {
          // Extract the relevant data from the API response
          const temperature = data.main.temp;
          const description = data.weather[0].description;
          const icon = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
          const city = data.name;
          const country = data.sys.country;

          // Display the weather data on the page
          const weatherHTML = `
            <div>
              <h2>${city}, ${country}</h2>
              <img src="${icon}" alt="${description}">
              <p>${description}</p>
              <h3>${temperature}&deg;C</h3>
            </div>
          `;
          weatherDataDiv.innerHTML = weatherHTML;
        })
        .catch(error => {
          console.log("Error fetching weather data:", error);
        });
    }






    function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred.");
                    break;
            }
        }

        function showMap() {
            if (map != null) {
                map.remove();
            }
            map = L.map('map').setView([lat, lon], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1
            }).addTo(map);
            L.marker([lat, lon]).addTo(map);
        }



