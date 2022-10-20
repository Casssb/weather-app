import { apiController } from './apiController';
import { storageController } from './storageController';
import { fromUnixTime, format } from 'date-fns';

const displayController = (() => {
  /* Search bar nodes */
  const searchInput = document.querySelector('#search');
  const searchListContainer = document.querySelector('#search-results');
  const clearSearchButton = document.querySelector('#search-close');
  /* Main content nodes */
  const todaySummaryContainer = document.querySelector(
    '#weather-today-summary'
  );
  const todayDetailedContainer = document.querySelector(
    '#weather-today-detailed'
  );
  const weekContainer = document.querySelector('#weather-week');

  /* Node to contain state of temperature toggle */
  let temp = 'metric';

  const passSearchCoordsToStorage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const target = e.target;
    const latitude = target.dataset.lat;
    const longitude = target.dataset.lon;
    storageController.updateLocalstorage(latitude, longitude);
    apiController.getWeatherData(latitude, longitude, temp);
    searchListContainer.innerHTML = '';
    searchInput.value = '';
    clearSearchButton.classList.remove('visible');
    weekContainer.innerHTML = '';
  };

  const createSearchListItem = (data) => {
    const listElem = document.createElement('li');
    listElem.classList.add('search-results-elem');
    listElem.setAttribute('data-lat', data.lat);
    listElem.setAttribute('data-lon', data.lon);
    listElem.textContent = data.formatted;
    listElem.addEventListener('click', (e) => {
      passSearchCoordsToStorage(e);
    });
    searchListContainer.append(listElem);
  };

  const createTodaysWeather = (apiData) => {
    todaySummaryContainer.innerHTML = '';
    todayDetailedContainer.innerHTML = '';

    const unitValue = temp === 'metric' ? 'C' : 'F';
    const distance = temp === 'metric' ? 'm/s' : 'm/h';
    /* Summary section info */
    const location = apiData.name;
    const country = apiData.sys.country;
    const date = format(fromUnixTime(apiData.dt), 'EEEE do MMM');
    const imgIcon = apiData.weather[0].icon;
    const imgAlt = apiData.weather[0].main;
    const currentTemp = Math.round(apiData.main.temp);
    const description = apiData.weather[0].description;
    /* Detailed section info*/
    const high = Math.round(apiData.main.temp_max);
    const low = Math.round(apiData.main.temp_min);
    const feelsLike = Math.round(apiData.main.feels_like);
    const humidity = apiData.main.humidity;
    const timezone = apiData.timezone + new Date().getTimezoneOffset() * 60;
    const sunrise = format(
      fromUnixTime(apiData.sys.sunrise + timezone),
      'h:mm a'
    );
    const sunset = format(
      fromUnixTime(apiData.sys.sunset + timezone),
      'h:mm a'
    );
    const windSpeed = apiData.wind.speed;
    const visibility = apiData.visibility;

    /* create & append summary section */
    const summaryContainer = document.createElement('div');
    summaryContainer.classList.add('summary-container');
    summaryContainer.innerHTML = `
    <h3 class="summary-title">${`${location}, ${country}`}</h3>
    <h4 class="summary-date">${date}</h4>
    <div class="summary-weather">
      <div class="summary-weather-img-wrapper">
        <img src="http://openweathermap.org/img/wn/${imgIcon}@2x.png" alt="${imgAlt}" />
      </div>
      <h2 class="summary-weather-temp">${`${currentTemp}°<span class="temp-unit">${unitValue}`}<span/></h2>
    </div>
    <h3 class="summary-description">${description}</h3>`;
    todaySummaryContainer.append(summaryContainer);

    /* Create & append details section */
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('today-detailed-container');
    detailsContainer.innerHTML = `
    <div class="today-detailed-card">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M17 3H21V5H17V3M17 7H21V9H17V7M17 11H21V13H17.75L17 12.1V11M21 15V17H19C19 16.31 18.9 15.63 18.71 15H21M7 3V5H3V3H7M7 7V9H3V7H7M7 11V12.1L6.25 13H3V11H7M3 15H5.29C5.1 15.63 5 16.31 5 17H3V15M15 13V5C15 3.34 13.66 2 12 2S9 3.34 9 5V13C6.79 14.66 6.34 17.79 8 20S12.79 22.66 15 21 17.66 16.21 16 14C15.72 13.62 15.38 13.28 15 13M12 4C12.55 4 13 4.45 13 5V8H11V5C11 4.45 11.45 4 12 4Z"
        />
      </svg>
      <div class="today-detailed-text">
        <h4 class="today-detailed-title">Feels Like</h4>
        <p class="today-detailed-value">${feelsLike}°</p>
      </div>
    </div>
    <div class="today-detailed-card">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z"
        />
      </svg>
      <div class="today-detailed-text">
        <h4 class="today-detailed-title">Humidity</h4>
        <p class="today-detailed-value">${humidity}%</p>
      </div>
    </div>
    </div>
    <div class="today-detailed-card">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z"
        />
      </svg>
      <div class="today-detailed-text">
        <h4 class="today-detailed-title">Temp High</h4>
        <p class="today-detailed-value">${high}°</p>
      </div>
    </div>
    <div class="today-detailed-card">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M14.25,12L16.27,11H23L22,9H18.03L20.42,5.83L19.43,3.83L15.37,9.2L13.35,10.21L13.75,8L17.83,2.62L15.64,2.22L12,7L8.4,2.2L6.2,2.6L10.26,8L10.66,10.21L8.82,9.29L8.66,9.21L4.6,3.8L3.6,5.8L6,9H2L1,11H7.77L9.75,12L7.73,13H1L2,15H5.97L3.58,18.17L4.57,20.17L8.63,14.8L10.65,13.79L10.25,16L6.17,21.38L8.36,21.79L12,17L15.6,21.8L17.8,21.4L13.74,16L13.34,13.79L15.34,14.79L19.4,20.2L20.4,18.2L18,15H22L23,13H16.23"
        />
      </svg>
      <div class="today-detailed-text">
        <h4 class="today-detailed-title">Temp Low</h4>
        <p class="today-detailed-value">${low}°</p>
      </div>
    </div>
    </div>
    <div class="today-detailed-card">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z"
        />
      </svg>
      <div class="today-detailed-text">
        <h4 class="today-detailed-title">Sunrise</h4>
        <p class="today-detailed-value">${sunrise}</p>
      </div>
    </div>
    <div class="today-detailed-card">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,20.71L15.82,17.6C16.21,17.21 16.21,16.57 15.82,16.18C15.43,15.79 14.8,15.79 14.41,16.18L12,18.59L9.59,16.18C9.2,15.79 8.57,15.79 8.18,16.18C7.79,16.57 7.79,17.21 8.18,17.6L11.29,20.71C11.5,20.9 11.74,21 12,21C12.26,21 12.5,20.9 12.71,20.71Z"
        />
      </svg>
      <div class="today-detailed-text">
        <h4 class="today-detailed-title">Sunset</h4>
        <p class="today-detailed-value">${sunset}</p>
      </div>
    </div>
    </div>
    <div class="today-detailed-card">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z"
        />
      </svg>
      <div class="today-detailed-text">
        <h4 class="today-detailed-title">Wind Speed</h4>
        <p class="today-detailed-value">${windSpeed} ${distance}</p>
      </div>
    </div>
    <div class="today-detailed-card">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"
        />
      </svg>
      <div class="today-detailed-text">
        <h4 class="today-detailed-title">Visibility</h4>
        <p class="today-detailed-value">${visibility}m</p>
      </div>
    </div>
    </div>`;
    todayDetailedContainer.append(detailsContainer);
  };

  const createFiveDayWeather = (apiData) => {
    const date = format(fromUnixTime(apiData.dt), 'EEEE do');
    const imgIcon = apiData.weather[0].icon;
    const imgAlt = apiData.weather[0].main;
    const high = Math.round(apiData.main.temp_max);
    const low = Math.round(apiData.main.temp_min);
    const summary = apiData.weather[0].description;

    /* create and append each daily forecast*/
    const dayContainer = document.createElement('div');
    dayContainer.classList.add('day-container');
    dayContainer.innerHTML = `
    <h4 class="day-date">${date}</h4>
    <div class="day-weather-wrapper">
      <div class="day-image-wrapper">
        <img
          src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
          alt="${imgAlt}"
        />
      </div>
      <div class="day-temp-wrapper">
        <h4 class="day-temp-high">${high}°</h4>
        <h4 class="day-temp-low">${low}°</h4>
      </div>
    </div>
    <h4 class="day-summary">${summary}</h4>`;
    weekContainer.append(dayContainer);
  };

  /* Listeners for search bar functionality */

  searchInput.addEventListener('input', async () => {
    searchIndex = 0;
    clearSearchButton.classList.add('visible');
    searchListContainer.innerHTML = '';
    const search = searchInput.value;
    apiController.debounceLocationData(search);
  });

  clearSearchButton.addEventListener('click', () => {
    searchInput.value = '';
    searchListContainer.innerHTML = '';
    clearSearchButton.classList.remove('visible');
  });

  /* Logic to allow keyboard use */

  /* Holds the state to allow key presses to loop search results */
  let searchIndex = 0;

  const handleKeyCoords = (list, elem) => {
    const latitude = list[elem].dataset.lat;
    const longitude = list[elem].dataset.lon;
    storageController.updateLocalstorage(latitude, longitude);
    apiController.getWeatherData(latitude, longitude, temp);
    searchListContainer.innerHTML = '';
    searchInput.value = '';
    clearSearchButton.classList.remove('visible');
    weekContainer.innerHTML = '';
  };

  searchInput.addEventListener('keydown', (e) => {
    const listItems = document.querySelectorAll('.search-results-elem');
    listItems.forEach((item) => {
      item.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    });

    if (listItems) {
      if (e.keyCode === 13) {
        e.preventDefault();
        handleKeyCoords(listItems, searchIndex);
        searchIndex = 0;
      } else if (e.keyCode === 40) {
        if (searchIndex >= listItems.length - 1) return;
        searchIndex += 1;
        listItems[searchIndex].style.backgroundColor = '#018881';
      } else if (e.keyCode === 38) {
        if (searchIndex === 0) return;
        searchIndex -= 1;
        listItems[searchIndex].style.backgroundColor = '#018881';
      }
    }
  });

  /* Listener for temperature toggle checkbox */
  const tempToggle = document.querySelector('#temp-checkbox');
  const coords = storageController.getCoords();
  tempToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      temp = 'imperial';
      apiController.getWeatherData(coords.lat, coords.lon, temp);
      weekContainer.innerHTML = '';
    } else {
      temp = 'metric';
      apiController.getWeatherData(coords.lat, coords.lon, temp);
      weekContainer.innerHTML = '';
    }
  });

  /* Listener to trigger Geolocation API on load (will return a default
    value from locastorage if users clicks block or there is an error) */

  window.addEventListener('load', () => {
    apiController.handleCurrentLocation(temp);
  });

  return { createSearchListItem, createTodaysWeather, createFiveDayWeather };
})();

export { displayController };
