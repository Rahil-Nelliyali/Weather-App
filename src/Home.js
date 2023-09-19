import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (name !== "") {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=e524b45a787ce231dad96d31adc50b43&units=metric`;
      axios.get(apiUrl)
        .then(res => {
          console.log(res.data);
          setData({
            celcius: res.data.main.temp,
            name: res.data.name,
            humidity: res.data.main.humidity,
            speed: res.data.wind.speed,
            dailyForecast: [],
            lastUpdated: new Date().toLocaleString(),
          });
          setError('');
        })
        .catch(err => {
          if (err.response && err.response.status === 404) {
            setError('Invalid City Name');
          } else {
            setError('');
          }
          console.log(err);
        });
    }
  }, [name]);

  const fetchDailyForecast = () => {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=e524b45a787ce231dad96d31adc50b43&units=metric`;
    axios.get(forecastUrl)
      .then(res => {
        console.log(res.data);
        const dailyData = res.data.list.filter(item => item.dt_txt.includes('12:00:00'));
        const dailyForecast = dailyData.map(item => ({
          date: item.dt_txt.split(' ')[0],
          temperature: item.main.temp,
          condition: item.weather[0].description,
        }));
        setData(prevData => ({ ...prevData, dailyForecast }));
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className='container'>
      <div className='weather'>
        <div className='search'>
          <input type='text' placeholder='Enter City Name' onChange={e => setName(e.target.value)} />
          <button onClick={fetchDailyForecast}>Search</button>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
