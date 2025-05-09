const formElement = document.querySelector("#search");
const inputElement = document.querySelector("#search__input");
const temp = document.querySelector("#temp");
const nameCity = document.querySelector("#name");
const humidity = document.querySelector("#humidity");
const speed = document.querySelector("#speed");
const info = document.querySelector(".info");
const info_img = document.querySelector(".img");
const searchButton = document.querySelector("#search__button");
const locationButton = document.querySelector("#location__button");

const API_KEY = "8c2c9c8e9e09018392f9ec0b874b046d";

searchButton.addEventListener("click", (e) => {
  formElement.requestSubmit();
});

locationButton.addEventListener("click", (e) => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const data = await getWeatherInfo(position.coords.latitude,position.coords.longitude);
    renderWeatherApp(processWeatherData(data));
  });
});

const processWeatherData = (data) => {
  const weather = {
    name: data.name,
    temp: Math.round(data.main.temp),
    humidity: Math.round(data.main.humidity),
    wind: Math.round(data.wind.speed),
    main: data.weather[0].main.toLowerCase(),
  };

  renderWeatherApp(weather);
};


formElement.onsubmit = async (e) => {
  e.preventDefault();

  if (!inputElement.value.trim()) {
    formElement.classList.remove("animation-error");
    void formElement.offsetWidth;
    formElement.classList.add("animation-error");
    return;
  }
  const cityInfo = await getGeoData(inputElement.value.trim());
  const weatherInfo = await getWeatherInfo(cityInfo[0].lat, cityInfo[0].lon);
  renderWeatherApp(processWeatherData(weatherInfo));
};

const getGeoData = async (name) => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

const getWeatherInfo = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  const data = await response.json();
  return data;
};

const renderWeatherApp = (data) => {
  info.classList.remove("none");
  inputElement.value = "";
  nameCity.textContent = data.name;
  temp.textContent = data.temp;
  humidity.textContent = data.humidity + "%";
  speed.textContent = data.wind + " km/h";
  console.log(data.main);

  switch (data.main) {
    case "sunny":
      info_img.setAttribute("src", "img/sunny.svg");
      break;
    case "clouds":
      info_img.setAttribute("src", "img/cloud.svg");
      break;
    default:
      info_img.setAttribute("src", "img/sunny.svg");
  }
};
console.log("hellow")