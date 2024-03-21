function updateClock() {
      var currentTime = new Date();
      var hours = currentTime.getHours();
      var minutes = currentTime.getMinutes();
      var seconds = currentTime.getSeconds();
      var meridiem = "AM";
      // Convert to 12-hour format
      if (hours > 12) {
      hours = hours - 12;
      meridiem = "PM";
      }
      // Pad single digit minutes and seconds with a leading zero
      minutes = (minutes < 10 ? "0" : "") + minutes;
      seconds = (seconds < 10 ? "0" : "") + seconds;
      // Display the time
      var clockDiv = document.getElementById("clock");
      clockDiv.innerHTML = hours + ":" + minutes + ":" + seconds + " " + meridiem;
      }
      // Update the clock every second
      setInterval(updateClock, 1000);
      // Initial call to display the clock immediately
      updateClock();