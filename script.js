const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

// No auto-load weather for Pune anymore
$(document).ready(function () {
    // Waiting for user interaction
});

async function weatherFn(cName) {
    if (!cName.trim()) {
        alert("Please enter a city name.");
        return;
    }

    const temp = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(temp);
        const data = await res.json();
        if (res.ok) {
            weatherShowFn(data);
            getForecast(cName);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data.', error);
    }
}

function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#temperature').html(`${data.main.temp}&deg;C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#weather-icon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    $('#weather-info').fadeIn();
}

async function getForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(forecastUrl);
        const data = await res.json();
        if (res.ok) {
            showForecast(data);
        }
    } catch (err) {
        console.error('Forecast error:', err);
    }
}

function showForecast(data) {
    const forecastHTML = [];
    const daysShown = new Set();

    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const time = item.dt_txt.split(' ')[1];

        if (time === "12:00:00" && !daysShown.has(date)) {
            daysShown.add(date);
            forecastHTML.push(`
                <div>
                    <p><strong>${moment(date).format('ddd, MMM D')}</strong></p>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" />
                    <p>${item.main.temp}&deg;C</p>
                    <p>${item.weather[0].description}</p>
                </div>
            `);
        }
    });

    $('#forecast').html(forecastHTML.join(''));
    $('#forecast-container').fadeIn();
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const geoUrl = `${url}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            try {
                const res = await fetch(geoUrl);
                const data = await res.json();
                if (res.ok) {
                    weatherShowFn(data);
                    getForecast(data.name);
                }
            } catch (err) {
                console.error('Geolocation error:', err);
            }
        }, () => {
            alert('Location access denied.');
        });
    } else {
        alert('Geolocation not supported in your browser.');
    }
}

function toggleDarkMode() {
    $('body').toggleClass('dark-mode');
}