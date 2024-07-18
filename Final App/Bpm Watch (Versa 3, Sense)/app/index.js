/* =================
    Smart Watch app
   ================= */

// https://dev.fitbit.com/getting-started/ explains how to start using the app
// npx fitbit

// Make sure Server is running before it reads any heart rate

let document = require("document");
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import * as messaging from "messaging";
import { BodyPresenceSensor } from "body-presence";

let hrLabel = document.getElementById("hrm");                               // Fetch UI elements we will need to change
let Off = document.getElementById("onOff");
hrLabel.text = "--";                                                        // Initialize the UI

/*  import * as fs from "fs";                                               // This was code that allowed the watch to write to a private file
    let ascii_data = 34 + "";
    fs.writeFileSync("ascii.txt", ascii_data, "ascii");

    let ascii_read = fs.readFileSync("ascii.txt", "ascii");
    console.log("ASCII Data: " + ascii_read); */

messaging.peerSocket.addEventListener("open", (evt) => {                    // Connects to the companion phone app
  console.log("Connection to companion opened");
});

messaging.peerSocket.addEventListener("error", (err) => {                   // Catches errors connecting to the companion phone app
  console.error(`Connection error: ${err.code} - ${err.message}`);
});

const hrm = new HeartRateSensor({ frequency: 1 });                          // Start up the heart rate sensor

if (BodyPresenceSensor) {                                                   // If body presence is successfully imported 

  const body = new BodyPresenceSensor();

  body.addEventListener("reading", () => {                                  // Activates each time the watch is removed/ put on an arm

    if (!body.present) {                                                    // If the watch isnt on someones body
      hrLabel.text = "--";
      Off.text = "Please put Fitbit back on";
      hrm.stop();                                                           // Stops the heart rate sensor

    } else {

      if (HeartRateSensor) {                                                // If heart rate is successfully imported 

        hrm = new HeartRateSensor({ frequency: 1 });                        // Starts up the heart rate sensor as it may have been stopped
        hrm.addEventListener("reading", () => {                             // Activates each time a heart rate is read

          console.log(`Current heart rate: ${hrm.heartRate}`);
          hrLabel.text = hrm.heartRate;                                     // Updates the UI
          sendMessage(hrm.heartRate);                                       // Sends the new heart rate
          Off.text = " ";
        });

        display.addEventListener("change", () => {                          // Stops working when display is off
          display.on ? hrm.start() : hrm.stop(); hrLabel.text = "--"; Off.text = "Fitbit was turned off";
        });

        hrm.start();
      }
    }
  });
  body.start();
}

function sendMessage(rate) {
  console.log("Sending message");                                           
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {      // Checks if the compain is aviable to recieve the data
    messaging.peerSocket.send(rate);                                        // Sends the data 
    console.log("Message sent");
  }
}



