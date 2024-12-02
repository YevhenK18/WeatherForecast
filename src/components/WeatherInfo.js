import React from 'react';

const WeatherInfo = ({ weather, groupedForecast, selectedDay, onDayClick }) => {
  if (!weather || !groupedForecast) {
    return <p>Enter a city to see the weather forecast.</p>;
  }

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}.png`;
  };

  return (
    <div>
      <h2>{weather.name}, {weather.sys.country}</h2>
      <p>{weather.weather[0].description}</p>
      <p>Temperature: {weather.main.temp.toFixed(1)}°C</p> 
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind: {weather.wind.speed} m/s</p>

      <h3>5-Day Forecast:</h3>
      <div className="weather-card-container">
        {groupedForecast.map((dayData, index) => {
          const date = new Date(dayData.date);
          const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });

          return (
            <div key={index} className="weather-card" onClick={() => onDayClick(dayData)}>
              <h4>{formattedDate}</h4>
              <p>{dayData.data[0].weather[0].description}</p>
              <p>Average Temperature: {(dayData.data.reduce((acc, item) => acc + item.main.temp, 0) / dayData.data.length).toFixed(1)}°C</p> 
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div>
          <h3>Hourly Forecast for {selectedDay.date}:</h3>
          <div className="hourly-weather-container">
            {selectedDay.data.map((hour, index) => {
              const date = new Date(hour.dt * 1000);
              const time = date.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false 
              });
              const iconUrl = getWeatherIcon(hour.weather[0].icon);

              return (
                <div key={index} className="hourly-weather-card">
                  <h4>{time}</h4>
                  <img src={iconUrl} alt={hour.weather[0].description} />
                  <p>{hour.main.temp.toFixed(1)}°C</p> 
                  <p>{hour.weather[0].description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherInfo;
