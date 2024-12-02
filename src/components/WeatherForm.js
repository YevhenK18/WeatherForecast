import React, { useState } from 'react';

const WeatherForm = ({ fetchWeather, savedCities, onCityClick }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
    setCity(''); 
  };

  const handleCityClick = (cityName) => {
    onCityClick(cityName); 
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeatherForm;
