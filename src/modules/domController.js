import { apiController } from './apiController';
import { storageController } from './storageController';
import { fromUnixTime, format } from 'date-fns';

const displayController = (() => {
  /* Search bar nodes */
  const searchInput = document.querySelector('#search');
  const searchListContainer = document.querySelector('#search-results');
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
    /* http://openweathermap.org/img/wn/10d@2x.png */
    const unitValue = temp === 'metric' ? 'C' : 'F';
    const distance = temp === 'metric' ? 'K' : 'M';
    /* Summary section info */
    const location = apiData.name;
    const country = apiData.sys.country;
    const date = format(fromUnixTime(apiData.dt), 'EEEE do MMM');
    const imgIcon = apiData.weather[0].icon;
    const imgAlt = apiData.weather[0].main;
    const currentTemp = Math.round(apiData.main.temp);
    const description = apiData.weather[0].description;
    /* Detailed section info*/
    const high = apiData.main.temp_max;
    const low = apiData.main.temp_min;
    const feelsLike = apiData.main.feels_like;
    const humidity = apiData.main.humidity;
    const sunrise = apiData.sys.sunrise;
    const sunset = apiData.sys.sunset;
    const windSpeed = apiData.wind.speed;
    const timezone = apiData.timezone;

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
      <h2 class="summary-weather-temp">${`${currentTemp}°${unitValue}`}</h2>
    </div>
    <h3 class="summary-description">${description}</h3>`;
    todaySummaryContainer.append(summaryContainer);

    console.log(apiData);
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
        <h4 class="day-temp-high">${high}</h4>
        <h4 class="day-temp-low">${low}</h4>
      </div>
    </div>
    <h4 class="day-summary">${summary}</h4>`
    weekContainer.append(dayContainer);
    console.log(apiData);
  };

  searchInput.addEventListener('input', async () => {
    searchListContainer.innerHTML = '';
    const search = searchInput.value;
    apiController.debounceLocationData(search);
  });

  window.addEventListener('load', () => {
    apiController.handleCurrentLocation(temp);
  });

  return { createSearchListItem, createTodaysWeather, createFiveDayWeather };
})();

export { displayController };
