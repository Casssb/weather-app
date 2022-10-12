const apiController = (() => {
  const WEATHER_API_KEY = 'c35f19687763a3d6d7b695ca8f7b9027';
  const SEARCH_API_KEY = '07bce3bcccec446b94c8c1089ba510ba';

  const locationData = async (text) => {
    try {
      const apiCall = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&format=json&apiKey=${SEARCH_API_KEY}`
      );
      const searchData = await apiCall.json();
      console.log(searchData);
    } catch (error) {
      console.log(error);
    }
  };

  const weatherData = async () => {
    try {
      const apiCall = await fetch();
    } catch (error) {
      console.log(error);
    }
  };

  return { locationData, weatherData };
})();

export { apiController };
