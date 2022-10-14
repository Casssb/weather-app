import { apiController } from './apiController';

const displayController = (() => {
  /* Search bar nodes */
  const searchInput = document.querySelector('#search');
  const searchListContainer = document.querySelector('#search-results');

  searchInput.addEventListener('input', () => {
    apiController.debounceLocationData(searchInput.value)
  });
})();

export { displayController };
