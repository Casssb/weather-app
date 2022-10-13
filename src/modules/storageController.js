const storageController = (() => {
  const LOCAL_STORAGE_COORDS_KEY = 'weather.coords';
  const coords = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COORDS_KEY)) || {
    lat: '365',
    long: '211',
  };

  const updateLocalstorage = (latitude, longitude) => {
    localStorage.clear();
    const coords = { lat: latitude, lon: longitude };
    localStorage.setItem(LOCAL_STORAGE_COORDS_KEY, JSON.stringify(coords));
  };

  const getCoords = () => {
    const details = coords;
    return details;
  };

  return { updateLocalstorage, getCoords };
})();

export { storageController };
