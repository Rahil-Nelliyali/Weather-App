import React, { useState } from 'react';
import './style.css';
import axios from 'axios';

function Home() {
  const [data, setData] = useState({
    celcius: 10,
    name: '',
    humidity: 10,
    speed: 2,
    dailyForecast: [],
    lastUpdated: '',
  });
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const fetchWeatherData = async () => {
    if (name !== "") {
      const apiKey = 'e524b45a787ce231dad96d31adc50b43';
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${apiKey}&units=metric`;

      try {
        const [weatherResponse, forecastResponse] = await Promise.all([
          axios.get(weatherUrl),
          axios.get(forecastUrl),
        ]);

        if (weatherResponse.data && forecastResponse.data) {
          const weatherData = weatherResponse.data;
          const forecastData = forecastResponse.data.list.filter(item =>
            item.dt_txt.includes('12:00:00')
          );

          setData({
            celcius: weatherData.main.temp,
            name: weatherData.name,
            humidity: weatherData.main.humidity,
            speed: weatherData.wind.speed,
            dailyForecast: forecastData.map(item => ({
              date: item.dt_txt.split(' ')[0],
              temperature: item.main.temp,
              condition: item.weather[0].description,
            })),
            lastUpdated: new Date().toLocaleString(),
          });

          setError('');
        } else {
          setError('City not found');
        }
      } catch (err) {
        setError('City not found');
        console.error(err);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    fetchWeatherData(); 
  };
  const handleShare = () => {
    const shareableURL = `https://weather-app-iota-orpin.vercel.app/`;
  
    navigator.clipboard.writeText(shareableURL)
    .then(() => {
      alert('Link copied to clipboard!');
    })
    .catch((error) => {
      console.error('Error copying to clipboard', error);
    });
};

  
  return (
    <div className='container'>
      <div className='weather'>
      <h1>Weather App</h1>
        <div className='search'>
          <form onSubmit={handleSubmit}>
            <input type='text' placeholder='Enter City Name' onChange={e => setName(e.target.value)} />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className='error'>
          <p>{error}</p>
        </div>
        {data.name && (
          <div className='winfo'>
            <img src={data.image} alt="" />
            <h1>{Math.round(data.celcius)}°C</h1>
            <h2>{data.name}</h2>
            <div className='details'>
              <div className='col'>
                <div className='humidity'>
                  <p>{Math.round(data.humidity)}%</p>
                  <p>Humidity</p>
                </div>
                <div className='wind'>
                  <p>{Math.round(data.speed)}km/h</p>
                  <p>Wind</p>
                </div>
              </div>
            </div>
            <div className='forecast'>
              <h3>Weather Forecast</h3>
              {data.dailyForecast.length > 0 ? (
                <ul>
                  {data.dailyForecast.map((forecast, index) => (
                    <li key={index}>
                      {forecast.date}: {forecast.condition} - {forecast.temperature}°C
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No forecast data available.</p>
              )}
            </div>
            <div className='last-updated'>
              <p>Last Updated: {data.lastUpdated}</p>
            </div>
            <div className='winfo'>

  <button onClick={handleShare}>Share App</button> 
</div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
