// lights colors
const lightTheme = {
  primary: '#0f172a',
  secondary: '#ffffff',
  tertiary: '#f8f8f8',
  accent: '#64748b',
};

const darkTheme = {
  primary: '#ffffff',
  secondary: '#0f172a',
  tertiary: '#1e293b',
  accent: '#94a3b8',
};

const lightmodeicon = `<svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 11.4597C5 15.6241 8.4742 19 12.7598 19C16.0591 19 18.8774 16.9993 20 14.1783C19.1109 14.5841 18.1181 14.8109 17.0709 14.8109C13.2614 14.8109 10.1732 11.8101 10.1732 8.1084C10.1732 6.56025 10.7134 5.13471 11.6205 4C7.87502 4.5355 5 7.67132 5 11.4597Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;

const darkmodeicon = `<svg width="24" height="24" viewBox="0 0 24 24" class="theme-icon" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg"><pathd="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"stroke-width="1.5"></pathd=>
<path d="M18.3117 5.68834L18.4286 5.57143M5.57144 18.4286L5.68832 18.3117M12 3.07394V3M12 21V20.9261M3.07394 12H3M21 12H20.9261M5.68831 5.68834L5.5714 5.57143M18.4286 18.4286L18.3117 18.3117" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

// DOM elements
const themeBox = document.querySelector('#theme-box');
const search = document.querySelector('#search-input');
const form = document.querySelector('#weather-form');
const alertData = document.querySelector('#alert-data');
const modalbox = document.querySelector('#alert');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const humidity = document.getElementById('humidity');
const visibility = document.getElementById('visibility');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const todayWeatherIcon = document.getElementById('today-weather-icon');
const todayWeatherTemp = document.querySelector('.current-weather-temperature');
const todayWeatherDescription = document.querySelector(
  '.current-weather-description'
);
const currentLocation = document.querySelector('.current-location');
const currentDate = document.querySelector('.current-date');
const hourlyWeather = document.querySelector('#hourly-forecast');
const filterContainer = document.querySelector('.filter-container');
const dailyWeatherForecast = document.querySelector('.daily-weather-forecast');

// API key
const API_KEY = 'c79f10f1a889e717c7c63390dc7e1af9';

// Variables
let forecastWeather = null;
let html = ``;
let theme = 'dark';

// Functions
const getLocation = async () => {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser.');
  }

  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  return position.coords;
};

const formatDate = (date) => {
  date = new Date(date * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const handleTheme = () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  const root_theme = document.querySelector(':root');
  let themeValues = theme === 'dark' ? darkTheme : lightTheme;
  theme === 'dark'
    ? (document.getElementById('theme-box').innerHTML = darkmodeicon)
    : (document.getElementById('theme-box').innerHTML = lightmodeicon);

  theme === 'dark'
    ? (document.querySelector('.logo_box-icon').src = './img/favicon-light.ico')
    : (document.querySelector('.logo_box-icon').src = './img/favicon-dark.ico');
  root_theme.style.setProperty('--primary', themeValues.primary);
  root_theme.style.setProperty('--secondary', themeValues.secondary);
  root_theme.style.setProperty('--tertiary', themeValues.tertiary);
  root_theme.style.setProperty('--accent', themeValues.accent);

  // card icons
  const cardIcons = document.querySelectorAll('.card-icon img');
  cardIcons.forEach((icon) => {
    icon.classList.toggle('white-icon');
  });
};

const fetchWeather = async () => {
  let city = search.value;
  let lat = null;
  let lon = null;
  let url = null;
  let forecastUrl = null;

  if (!city) {
    try {
      const coords = await getLocation();
      lat = coords.latitude;
      lon = coords.longitude;
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } catch (err) {
      city = 'islamabad';
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    }
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod != 200) {
      throw new Error(data.message);
    }

    todayWeatherDescription.innerHTML = data.weather[0].description;
    todayWeatherIcon.src = `./img/animated/${data.weather[0].icon}.svg`;
    todayWeatherTemp.innerHTML = `${Math.round(data.main.temp)}°C`;
    pressure.innerHTML = `${data.main.pressure} hPa`;
    humidity.innerHTML = `${data.main.humidity}%`;
    visibility.innerHTML = `${data.visibility / 1000} km`;
    windSpeed.innerHTML = `${data.wind.speed} m/s`;
    sunrise.innerHTML = `${new Date(data.sys.sunrise * 1000).toLocaleTimeString(
      [],
      { hour: '2-digit', minute: '2-digit' }
    )}`;
    sunset.innerHTML = `${new Date(data.sys.sunset * 1000).toLocaleTimeString(
      [],
      { hour: '2-digit', minute: '2-digit' }
    )}`;
    currentDate.innerHTML = `${new Date().toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })}`;
    currentLocation.innerHTML = `${data.name}, ${data.sys.country}`;
    modalbox.classList.contains('hide') ? null : modalbox.classList.add('hide');
  } catch (err) {
    alertData.innerHTML = err;
    modalbox.classList.contains('hide')
      ? modalbox.classList.remove('hide')
      : null;
  }

  try {
    const response = await fetch(forecastUrl);
    const data = await response.json();
    if (data.cod != 200) {
      throw new Error(data.message);
    }
    forecastWeather = data.list;

    html = ``;
    for (let i = 0; i < 5; i++) {
      html += `
      <div
      class="hourly-weather-forecast-card flex flex-row gap-4 justify-between items-center"
    >
      <div class="hourly-weather-forecast-date-time">
        <div class="hourly-weather-forecast-date">${new Date(
          forecastWeather[i].dt * 1000
        ).toLocaleDateString([], { weekday: 'long' })}</div>
        <div class="hourly-weather-forecast-time">${new Date(
          forecastWeather[i].dt * 1000
        ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div class="hourly-weather-forecast-temperature">
      ${Math.round(forecastWeather[i].main.temp)}°C
      </div>
    </div>
      `;
    }

    hourlyWeather.innerHTML = html;
    html = ``;

    html = `<div data-date="all" class="filter-item rounded-lg py-2 px-4 active">All Days</div>`;
    for (let i = 1; i < 6; i++) {
      html += `<div data-date="${formatDate(
        forecastWeather[0].dt + i * 24 * 3600
      )}" class="filter-item rounded-lg py-2 px-4">${new Date(
        forecastWeather[0].dt * 1000 + i * 24 * 3600 * 1000
      ).toLocaleDateString([], {
        day: 'numeric',
        month: 'short',
        weekday: 'short',
      })}</div>`;
    }

    filterContainer.innerHTML = html;
    filterItems('all');
    modalbox.classList.contains('hide') ? null : modalbox.classList.add('hide');
  } catch (err) {
    alertData.innerHTML = err;
    modalbox.classList.contains('hide')
      ? modalbox.classList.remove('hide')
      : null;
  }
};

const filterItems = (date) => {
  html = ``;

  forecastWeather.forEach((item) => {
    if (date == 'all' || formatDate(item.dt) == date) {
      html += `
        <div
            class="daily-weather-forecast-card rounded-lg flex justify-between p-7 col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3"
          >
            <div class="daily-weather-forecast-date-time">
              <div class="daily-weather-forecast-date">${new Date(
                item.dt * 1000
              ).toLocaleDateString([], { weekday: 'long' })}</div>
              <div class="daily-weather-forecast-time">${new Date(
                item.dt * 1000
              ).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}</div>
            </div>
            <div class="daily-weather-forecast-details flex">
              <div class="weather_card-icon card-icon">
                <img class=" ${
                  theme === 'dark' ? 'white-icon' : null
                }" src="./img/static/${item.weather[0].icon}.svg" alt="" />
              </div>
              <div class="daily-weather-forecast-details--temp">
                <div class="daily-weather-forecast-details--temp-value">${Math.round(
                  item.main.temp
                )}°C</div>
                <div class="daily-weather-forecast-details--temp-name">${
                  item.weather[0].description
                }</div>
              </div>
            </div>
          </div>
        `;
    }
  });

  dailyWeatherForecast.innerHTML = html;
  html = ``;
};

const handleForecastFilter = (e) => {
  let filterItem = e.target;
  filterContainer.childNodes.forEach((item) => {
    item.classList.contains('active') ? item.classList.remove('active') : null;
  });
  filterItem.classList.add('active');
  let date = filterItem.dataset.date;
  filterItems(date);
};

// Event listeners
fetchWeather();
form.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchWeather();
});
filterContainer.addEventListener('click', handleForecastFilter);

document.getElementById('alert-close').addEventListener('click', () => {
  modalbox.classList.add('hide');
});

themeBox.addEventListener('click', handleTheme);
