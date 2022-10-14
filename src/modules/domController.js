import { apiController } from './apiController';
import { storageController } from './storageController';

const displayController = (() => {
  /* Search bar nodes */
  const searchInput = document.querySelector('#search');
  const searchListContainer = document.querySelector('#search-results');
  /* Node to contain state of temperature toggle */
  let temp = 'metric';

  const passSearchCoordsToStorage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const target = e.target
    const latitude = target.dataset.lat;
    const longitude = target.dataset.lon;
    storageController.updateLocalstorage(latitude, longitude);
    apiController.todaysWeatherData(latitude, longitude, temp);
    searchListContainer.innerHTML = ''
    searchInput.value = '';
  }
  
  const createSearchListItem = (data) => {
    const listElem = document.createElement('li');
    listElem.classList.add('search-results-elem');
    listElem.setAttribute('data-lat', data.lat);
    listElem.setAttribute('data-lon', data.lon);
    listElem.textContent = data.formatted;
    listElem.addEventListener('click', (e) => {
      passSearchCoordsToStorage(e)
    })
    searchListContainer.append(listElem);
  };

  const appendSearchListItem = () => {};

  searchInput.addEventListener('input', async () => {
    searchListContainer.innerHTML = ''
    const search = searchInput.value;
    apiController.debounceLocationData(search);
  });

  window.addEventListener('load', () => {
    apiController.handleCurrentLocation(temp);
  })

  return {createSearchListItem};
})();

export { displayController };
