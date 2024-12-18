const apiKey = 'feb6222e4f505d0b2c7dd8efccdfbf5c';
const weatherContainer = document.getElementById('weather-container');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const favoritesList = document.getElementById('favorites-list');
const searchHistoryList = document.getElementById('search-history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

const loadFavorites = () => JSON.parse(localStorage.getItem('favorites')) || [];
const saveFavorites = (favorites) => localStorage.setItem('favorites', JSON.stringify(favorites));

const loadSearchHistory = () => JSON.parse(localStorage.getItem('searchHistory')) || [];
const saveSearchHistory = (history) => localStorage.setItem('searchHistory', JSON.stringify(history));

async function getWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City "${city}" not found.`);
      } else {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    alert(error.message);
  }
}
function displayWeather(data) {
  if (data && data.weather && data.weather[0]) {
    const { name, main, weather } = data;
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherContainer.innerHTML = `
      <h2>${name}</h2>
      <img src="${iconUrl}" alt="${weather[0].description}" style="width: 100px; height: 100px;">
      <p>Teplota: ${main.temp}°C</p>
      <p>Jak vypadá počasí: ${weather[0].description}</p>
      <button onclick="addFavorite('${name}')">Přidat k oblíbeným</button>
    `;
  } else {
    weatherContainer.innerHTML = '<p>No weather data available.</p>';
  }
}
function addFavorite(city) {
  let favorites = loadFavorites();
  if (!favorites.includes(city)) {
    favorites.push(city);
    saveFavorites(favorites);
    updateFavoritesList();
  }
}
function updateFavoritesList() {
  const favorites = loadFavorites();
  favoritesList.innerHTML = favorites
    .map(
      (city) => `
      <li>
        ${city}
        <button onclick="removeFavorite('${city}')">Smazat z oblíbených</button>
      </li>
    `
    )
    .join('');
}
function removeFavorite(city) {
  let favorites = loadFavorites();
  favorites = favorites.filter((fav) => fav !== city);
  saveFavorites(favorites);
  updateFavoritesList();
}
function displaySearchHistory() {
  const history = loadSearchHistory();
  searchHistoryList.innerHTML = history
    .map(
      (city) => `
      <li>
        ${city}
        <button onclick="getWeather('${city}')">Zobrazit počasí</button>
      </li>
    `
    )
    .join('');
}
function updateSearchHistory(city) {
  let history = loadSearchHistory();
  if (!history.includes(city)) {
    history.push(city);
    saveSearchHistory(history);
    displaySearchHistory();
  }
}
function clearSearchHistory() {
  saveSearchHistory([]); 
  displaySearchHistory(); 
}
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
    updateSearchHistory(city);
  }
});
clearHistoryBtn.addEventListener('click', clearSearchHistory);

document.addEventListener('DOMContentLoaded', () => {
  updateFavoritesList();
  displaySearchHistory();
  getWeather('Prague'); 
});






