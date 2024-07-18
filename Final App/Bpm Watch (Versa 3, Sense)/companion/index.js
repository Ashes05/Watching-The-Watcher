/* ===============
    Companion app
   =============== */

// npx fitbit

import * as messaging from "messaging";

let pre = 0 ;

console.log("Companion code started");

messaging.peerSocket.addEventListener("open", (evt) => {
  console.log("Ready to send or receive messages");
});

messaging.peerSocket.addEventListener("error", (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});

messaging.peerSocket.addEventListener("message", (evt) => {                 // Activates whenever the watch sends the data

  if(pre != evt.data)                                                       // Stops the watch sending the same number multiple times
    {
      //console.log(JSON.stringify(evt.data));     
      var url="http://localhost:3000/heart";
      //console.log(url);
      let heartrate = {bpm: evt.data};
      heartrate = JSON.stringify(heartrate);
      pre = evt.data;

      fetch(url,                                                             // This method connects the server to the app
        {
          method: 'POST',                                                    // Sends a post request to the server
          headers: {
          'Content-Type': 'application/json',
          } ,
          body:heartrate
        }).then(function(response) {
          return response.text();
        }).then(function(text) {
          console.log("Got this response from server: " + text); });

        console.log("Sent");
    }
  });

  
