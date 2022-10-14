const storageController = (() => {
  const LOCAL_STORAGE_COORDS_KEY = 'weather.coords';
  const coords = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COORDS_KEY)) || {
    lat: '365',
    lon: '211',
  };

  const updateLocalstorage = (latitude, longitude) => {
    coords.lat = latitude;
    coords.lon = longitude;
  };

  const getCoords = () => {
    const details = coords;
    return details;
  };

  return { updateLocalstorage, getCoords };
})();

export { storageController };
