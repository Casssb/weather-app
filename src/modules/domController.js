import { apiController } from './apiController';

const displayController = (() => {
  /* Search bar nodes */
  const searchInput = document.querySelector('#search');
  const searchListContainer = document.querySelector('#search-results');

  const createSearchListItem = (data) => {
    const listElem = document.createElement('li');
    listElem.classList.add('search-results-elem');
    listElem.setAttribute('data-lat', data.lat);
    listElem.setAttribute('data-lon', data.lon);
    listElem.textContent = data.formatted;
    searchListContainer.append(listElem);
  };

  const appendSearchListItem = () => {};

  searchInput.addEventListener('input', async () => {
    searchListContainer.innerHTML = ''
    const search = searchInput.value;
    apiController.debounceLocationData(search);
  });

  return {createSearchListItem};
})();

export { displayController };
