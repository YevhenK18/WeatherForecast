import React, { useState, useEffect } from 'react';
import WeatherForm from './components/WeatherForm';
import WeatherInfo from './components/WeatherInfo';

// Работа с куки
const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`;
};

const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return JSON.parse(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

const App = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [savedCities, setSavedCities] = useState([]);
  const [favoriteCities, setFavoriteCities] = useState([]);

  // Загружаем любимые города из куки при монтировании компонента
  useEffect(() => {
    const favoriteCitiesFromCookie = getCookie('favoriteCities');
    if (favoriteCitiesFromCookie) {
      setFavoriteCities(favoriteCitiesFromCookie);
    }
  }, []);

  const fetchWeather = async (city) => {
    const apiKey = 'fc6475289a1d9f8f7909696303c2705b';
    const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`;

    try {
      const response = await fetch(geoUrl);
      if (!response.ok) throw new Error('City not found or request error');
      const data = await response.json();

      const { lat, lon } = data.coord;

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`;
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) throw new Error('Error fetching forecast');
      const forecastData = await forecastResponse.json();

      setWeather(data);
      setForecast(forecastData.list);

      // Добавляем город в сохраненные, если его нет в списке
      if (!savedCities.includes(city)) {
        setSavedCities((prev) => [...prev, city]);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      setWeather(null);
      setForecast(null);
    }
  };

  const getGroupedForecast = () => {
    if (!forecast) return [];
    const groupedData = [];

    forecast.forEach((entry) => {
      const date = new Date(entry.dt * 1000);

      const day = date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const existingDay = groupedData.find((item) => item.date === day);
      if (existingDay) {
        existingDay.data.push(entry);
      } else {
        groupedData.push({
          date: day,
          data: [entry],
        });
      }
    });

    return groupedData;
  };

  const handleCityClick = (cityName) => {
    fetchWeather(cityName);
  };

  const handleDayClick = (dayData) => {
    setSelectedDay(dayData);
  };

  // Функция для добавления/удаления города из избранного
  const toggleFavoriteCity = (city) => {
    setFavoriteCities((prev) => {
      let updatedFavorites;
      if (prev.includes(city)) {
        updatedFavorites = prev.filter((item) => item !== city);
      } else {
        updatedFavorites = [...prev, city];
      }
      // Обновляем куки после изменения
      setCookie('favoriteCities', updatedFavorites, 30); // Сохраняем на 30 дней
      return updatedFavorites;
    });
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h1>Weather Forecast</h1>
        <WeatherForm
          fetchWeather={fetchWeather}
          savedCities={savedCities}
          favoriteCities={favoriteCities}
          onCityClick={handleCityClick}
          onToggleFavorite={toggleFavoriteCity}
        />
        <div className="favorite-cities">
          <h2>Favorite Cities</h2>
          <ul>
            {favoriteCities.length > 0 ? (
              favoriteCities.map((city, index) => (
                <li key={index}>
                  <button onClick={() => handleCityClick(city)}>
                    {city}
                  </button>
                  <button onClick={() => toggleFavoriteCity(city)}>
                    Remove
                  </button>
                </li>
              ))
            ) : (
              <li>No favorite cities</li>
            )}
          </ul>
        </div>
      </div>
      <div className="main-content">
        <WeatherInfo
          weather={weather}
          groupedForecast={getGroupedForecast()}
          selectedDay={selectedDay}
          onDayClick={handleDayClick}
        />
      </div>
    </div>
  );
};

export default App;
