

let monitoringInterval;
let selectedLocation;

const apiKey = 'f363c6f19c364fe5955182616230308';

// Function to start monitoring
function startMonitoring() {
  monitoringInterval = document.getElementById('intervalInput').value;
  selectedLocation = document.getElementById('locationInput').value;

  if (monitoringInterval && selectedLocation) {
    // Convert interval to milliseconds
    const intervalInMillis = monitoringInterval * 10 * 1000; // minutes to milliseconds

    setInterval(getWeather, intervalInMillis);
    getWeather();
  } else {
    console.error('Please enter both interval and location.');
  }
}

// Function to request permission and show push notification
function showNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body });
      }
    });
  }
}

// Function to fetch weather data and show a push notification as a reminder
async function getWeather() {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${selectedLocation}&aqi=no`
    );

    if (!response.ok) {
      throw new Error('Weather data not available');
    }

    const weatherData = await response.json();

    // Extract temperature from the response
    const temperature = weatherData.current.temp_c;

    // Show weather information as a push notification
    showNotification('Weather Reminder', `Current weather in ${selectedLocation}: ${temperature}°C`);

  } catch (error) {
    console.error('Error fetching weather:', error.message);
  }
}

// Event listener for the button click
document.getElementById('startButton').addEventListener('click', startMonitoring);
