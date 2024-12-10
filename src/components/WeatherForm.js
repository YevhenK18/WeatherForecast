import React, { useState } from 'react';

const WeatherForm = ({ fetchWeather, savedCities, favoriteCities, onCityClick, onToggleFavorite }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
    setCity(''); 
  };

  const handleCityClick = (cityName) => {
    onCityClick(cityName); 
  };

  const handleFavoriteClick = (cityName) => {
    onToggleFavorite(cityName); 
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="weather-form">
        <input
          type="text"
          placeholder="Enter a city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button type="submit">Get Weather</button>
      </form>

      {savedCities.length > 0 && (
        <div className="saved-cities">
          <h4>Recently Searched:</h4>
          <ul>
            {savedCities.map((city, index) => (
              <li key={index} onClick={() => handleCityClick(city)}>
                {city}
                <button
                  onClick={() => handleFavoriteClick(city)}
                  style={{
                    background: favoriteCities.includes(city) ? 'gold' : '#ccc',
                    border: 'none',
                    padding: '5px',
                    marginLeft: '10px',
                    cursor: 'pointer',
                  }}
                >
                  {favoriteCities.includes(city) ? 'Unfavorite' : 'Favorite'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeatherForm;
