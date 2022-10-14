const storageController = (() => {
  const LOCAL_STORAGE_COORDS_KEY = 'weather.coords';
  const coords = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COORDS_KEY)) || {
    lat: '51.5073219',
    lon: '-0.1276474',
  };

  const updateLocalstorage = (latitude, longitude) => {
    coords.lat = latitude;
    coords.lon = longitude;
    localStorage.setItem(LOCAL_STORAGE_COORDS_KEY, JSON.stringify(coords));
  };

  const updateLocalstorageOnLoad = () => {
    localStorage.setItem(LOCAL_STORAGE_COORDS_KEY, JSON.stringify(coords));
  };

  const getCoords = () => {
    const details = coords;
    return details;
  };

  return { updateLocalstorage, updateLocalstorageOnLoad, getCoords };
})();

export { storageController };
