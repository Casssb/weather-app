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
      if (!apiCall.ok) throw new Error('data not found');

      const searchData = await apiCall.json();
      return searchData;
    } catch (error) {
      console.log(error);
    }
  };

  const debounceLocationData = (text, delay = 1000) => {
    /*Will only allow the API to be called if a certain amount of time
     has passed since the first input. There must be more than 3 characters
     entered for the API to be called at all*/
    if (text.length < 3) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const delayedResponse = locationData(text);
      delayedResponse.then((data) => console.log(data.results));
    }, delay);
  };

  const weatherData = async () => {
    try {
      const apiCall = await fetch();
    } catch (error) {
      console.log(error);
    }
  };

  return { debounceLocationData, weatherData };
})();

export { apiController };
