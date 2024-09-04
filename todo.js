$(document).ready(function() {
  const API_KEY = "f363c6f19c364fe5955182616230308";

  $("#task-form").submit(function(e) {
    e.preventDefault();

    let task = $("#task-input").val();
    let category = $("#task-category").val();
    let city = $("#city-input").val();
    let reminderTime = $("#reminderTime").val();
    let reminderMessage = $("#reminderMessage").val();

    $.ajax({
      url: `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`,
      method: "GET"
    }).done(function(response) {
      let temperature = response.current.temp_c;
      let precipitation = response.current.condition.text;

      let weatherSuitable;
      let message = "";

      if (category === "indoor") {
        weatherSuitable = true;
      } else if (category === "outdoor") {
        if (temperature > 8 && temperature < 37 && !precipitation.includes("rain")) {
          weatherSuitable = true;
        } else {
          weatherSuitable = false;
          if (temperature <= 8) {
            message = `Too Cold (${temperature}°C)`;
          } else if (temperature >= 37) {
            message = `Too Hot (${temperature}°C)`;
          } else if (precipitation.includes("rain")) {
            message = "Rainy";
          }
        }
      }

      let taskElement = $("<li>").text(task);
      if (!weatherSuitable) {
        taskElement.addClass("red");
        let messageElement = $("<span>").text(` - ${message}`).addClass("message");
        taskElement.append(messageElement);
        $("#task-list").append(taskElement);
      }
      if(weatherSuitable)
      {
        taskElement.addClass("green")
        taskElement.append(" and Weather is suitable");
        $("#task-list").append(taskElement);
      }

      // Set reminder functionality
      setReminder(reminderTime, reminderMessage);
    }).fail(function(error) {
      console.error("Failed to retrieve weather data", error);
    });
  });

  // Function to set reminders
  function setReminder(reminderTime, reminderMessage) {
    const now = new Date();
    const reminderDate = new Date(reminderTime);

    const timeDiff = reminderDate - now;

    if (timeDiff > 0) {
      setTimeout(() => {
        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('Reminder', { body: reminderMessage });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(function(permission) {
              if (permission === 'granted') {
                new Notification('Reminder', { body: reminderMessage });
              }
            });
          }
        }
      }, timeDiff);
    }
  }
});
