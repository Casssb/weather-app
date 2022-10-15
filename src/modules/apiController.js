import { displayController } from './domController';
import { storageController } from './storageController';

const apiController = (() => {
  const WEATHER_API_KEY = 'c35f19687763a3d6d7b695ca8f7b9027';
  const SEARCH_API_KEY = '07bce3bcccec446b94c8c1089ba510ba';
  let timer; /* holds the state for debouncing the API calls
  (starts undefined to force the timeout to wait)*/

  const locationData = async (text) => {
    try {
      const apiCall = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&format=json&apiKey=${SEARCH_API_KEY}`,
        { mode: 'cors' }
      );
      if (!apiCall.ok) throw new Error(apiCall.statusText);

      const searchData = await apiCall.json();
      return searchData;
    } catch (error) {
      console.log(error);
    }
  };

  const debounceLocationData = (text, delay = 500) => {
    /*Will only allow the API to be called if a certain amount of time
     has passed since the first input. There must be more than 3 characters
     entered for the API to be called at all*/
    if (text.length < 3) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const delayedResponse = locationData(text);
      delayedResponse
        .then((data) => data.results)
        .then((result) =>
          result.forEach((result) =>
            displayController.createSearchListItem(result)
          )
        );
    }, delay);
  };

  const getWeatherData = async (latitude, longitude, temp) => {
    const units = temp;
    const lat = latitude;
    const lon = longitude;
    try {
      const [todayResponse, fiveDayResponse] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`,
          { mode: 'cors' }
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`,
          { mode: 'cors' }
        ),
      ]);
      if (!todayResponse.ok) throw new Error(todayResponse.statusText);
      if (!fiveDayResponse.ok) throw new Error(fiveDayResponse.statusText);

      const todaysWeather = await todayResponse.json();
      const fiveDayWeather = await fiveDayResponse
        .json()
        .then((data) => data.list)
        .then((data) => data.filter((elem, index) => index % 8 === 0));
      fiveDayWeather.forEach((index) => {
        displayController.createFiveDayWeather(index);
      });
      displayController.createTodaysWeather(todaysWeather);
    } catch (error) {
      console.log(error);
    }
  };

  const storeCurrentLocation = (data) => {
    const lat = String(data.coords.latitude);
    const lon = String(data.coords.longitude);
    storageController.updateLocalstorage(lat, lon);
  };

  /* Gets user's current location in the form of a promise .This seems to be
    the only way I've been able to allow for the Geolocation API to return
    any form of an error state to enable loading other default coords
    (if loaded outside of an async state it just perpetually seems to
     wait for a response) */
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  /* If the Geolocation API request isn't accepted then the default
  coords found in local storage are returned*/
  const handleCurrentLocation = async (temp) => {
    try {
      const position = await getCurrentLocation();
      storeCurrentLocation(position);
      apiController.getWeatherData(
        position.coords.latitude,
        position.coords.longitude,
        temp
      );
    } catch {
      storageController.updateLocalstorageOnLoad();
      const coords = storageController.getCoords();
      apiController.getWeatherData(coords.lat, coords.lon, temp);
    }
  };

  return { debounceLocationData, getWeatherData, handleCurrentLocation };
})();

export { apiController };
