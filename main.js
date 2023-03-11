const APP_ID = 'cd4451dfb9af8ad63b87e1ee5e4e7dc2';

const temperature = document.querySelector('.temperature');
const cityCurrent = document.querySelector('.place__name');
const timeCurrent = document.querySelector('.place__time');
const icon = document.querySelector('.icon__weather');
const iconName = document.querySelector('.icon__name');

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cloudy = document.getElementById('cloudy');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');

const locationHistory = document.querySelector('.weather__detail__location');
const background = document.querySelector('.background');
const weatherBackground = document.querySelector('.weather');
let bgWeather;
let search;

// ========== even enter input ==========
searchInput.addEventListener('keyup', function (e) {
    search = e.target.value;

    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// ========== history ==========
// unique element
function unique(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

// show history
const searchHistory = (flag) => {
    if (flag === false) return;
    locationHistory.innerHTML = '';
    let history = localStorage.getItem('history') || ['Birmingham', 'Manchester', 'New York', 'California'];
    let arr;

    if (localStorage.getItem('history')) {
        history = history.split(',');
        arr = [search, ...history];
        arr = unique(arr).splice(0, 4);
    } else {
        arr = [...history];
    }

    localStorage.setItem('history', arr);
    arr.forEach((element) => {
        locationHistory.innerHTML += `<span class="weather__detail__location__name">${element}</span>`;
    });
};
searchHistory();

// event click history element
locationHistory.addEventListener('click', (e) => {
    search = e.target.innerHTML;
    console.log(search);
    if (search) {
        searchBtn.click();
    }
});

// clear localStorage when f5
window.onbeforeunload = () => {
    localStorage.removeItem('history');
    return '';
};

// ========== location default ==========
// show weather location
const showPosition = async (position) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${APP_ID}&units=metric`;
    try {
        let data = await asyncAwait(url);
        console.log(data);
        changeBackground(data.weather[0].main);
        changeInnerHTML(data);
    } catch (error) {
        alert('City Not Found');
    }
    searchHistory(false);
};

// get location
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
};
getLocation();

// ========== Change design ==========
// Change HTML when get API
const changeInnerHTML = (data) => {
    const d = new Date(data.dt * 1000);
    const date = d.toGMTString().split(' ');
    const day = date[0];
    const dayOfMonth = date[1];
    const month = date[2];
    const year = date[3].slice(2, 4);
    const hour = date[4].slice(0, 5);
    const time = `${hour} - ${day} ${dayOfMonth} ${month} ${year}`;

    temperature.innerHTML = Math.round(data.main.temp);
    cityCurrent.innerHTML = data.name;
    timeCurrent.innerHTML = time;
    icon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    iconName.innerHTML = data.weather[0].main;

    cloudy.innerHTML = `${data.clouds.all}%`;
    humidity.innerHTML = `${data.main.humidity}%`;
    wind.innerHTML = `${(data.wind.speed * 3.6).toFixed(2)}km/h`;
};

// change background from weather
const changeBackground = (bgWeather) => {
    switch (bgWeather) {
        case 'Thunderstorm':
            background.style.backgroundImage = "url('./assets/img/thunderstorm.png')";
            weatherBackground.style.backgroundImage = "url('./assets/img/thunderstorm.png')";
            break;
        case 'Drizzle':
            background.style.backgroundImage = "url('./assets/img/drizzle.png')";
            weatherBackground.style.backgroundImage = "url('./assets/img/drizzle.png')";
            break;
        case 'Rain':
            background.style.backgroundImage = "url('./assets/img/rain.png')";
            weatherBackground.style.backgroundImage = "url('./assets/img/rain.png')";
            break;
        case 'Snow':
            background.style.backgroundImage = "url('./assets/img/snow.png')";
            weatherBackground.style.backgroundImage = "url('./assets/img/snow.png')";
            break;
        case 'Clear':
            background.style.backgroundImage = "url('./assets/img/clear.png')";
            weatherBackground.style.backgroundImage = "url('./assets/img/clear.png')";
            break;
        case 'Clouds':
            background.style.backgroundImage = "url('./assets/img/clouds.png')";
            weatherBackground.style.backgroundImage = "url('./assets/img/clouds.png')";
            break;
        default:
            background.style.backgroundImage = "url('./assets/img/atmosphere.png')";
            weatherBackground.style.backgroundImage = "url('./assets/img/atmosphere.png')";
            break;
    }
};

// ========== Call API ==========
// Async await
const asyncAwait = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

// Promise
const promise = (url) => {
    return new Promise(function (resolve, reject) {
        const request = new XMLHttpRequest();
        request.onload = function () {
            if (this.status === 200) {
                resolve(request.response);
            } else {
                reject(request.response);
            }
        };
        request.open('GET', url, true);
        request.send();
    });
};

// Callback
const callbackXML = (url, callback) => {
    const request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
        if (request.readyState === 4 && request.status === 200) {
            let data = JSON.parse(request.responseText);
            callback(undefined, data);
        } else if (request.readyState === 4) {
            callback('City Not Found', undefined);
        }
    });
    request.open('GET', url);
    request.send();
};

// ========== event click button ==========
const getData = searchBtn.addEventListener('click', async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${APP_ID}&units=metric`;

    //  ========== Async await ==========
    try {
        let data = await asyncAwait(url);
        console.log(data);
        changeBackground(data.weather[0].main);
        changeInnerHTML(data);
    } catch (error) {
        alert('City Not Found');
    }

    // // ========== promise ==========
    // promise(url)
    //     .then(function (response) {
    //         const data = JSON.parse(response);
    //         changeInnerHTML(data);
    //     })
    //     .catch(function (err) {
    //         alert('City Not Found');
    //     });

    // // ========== callback ==========
    // callbackXML(url, (err, data) => {
    //     if (err) {
    //         return alert(err);
    //     }

    //     if (data) {
    //         changeInnerHTML(data);
    //     }
    // });

    // update history
    searchHistory();
});
