/* =======================
    Localhost for the app
   ======================= */

// To run type "node Server" into the Terminal
// I have commented out all of the firebase connection code

// npm install mongodb
// npm install node
// npm install express 

const express = require('express');
const {MongoClient } = require('mongodb');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const functions = require("firebase-functions")

// const { initializeApp } = require ("firebase/app");
// const { getFirestore, addDoc , collection } = require ("firebase/firestore");

const app = express(); 
const uri = "Enter your own MongoDB atlas database";

// const firebaseConfig = {
//   apiKey: "",
//   authDomain: "bpm-tracker.firebaseapp.com",
//   databaseURL: "https://bpm-tracker-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "bpm-tracker",
//   storageBucket: "bpm-tracker.appspot.com",
//   messagingSenderId: "414432484054",
//   appId: "1:414432484054:web:a5f22d40ca082b01070777",
//   measurementId: "G-5QS6F4CBWM"
// };

// const appFb = initializeApp(firebaseConfig);
// const firestoredb = getFirestore(appFb);

app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

async function connectToDB() {
  client = new MongoClient(uri);
  await client.connect();
}

connectToDB() 

app.post('/heart', async (req, res) => {
  try {
    
    // const docRef = await addDoc(collection(db, "BPM"), req.body);

                                                                                                     // Adds it to a Mongodb database
      const database = client.db("Fitbit");                                                          // Connects to the database
      await database.collection('BPM').deleteMany({});                                               // Deletes all previous values, can add a filter to it so we can use it with multiple users
      const collection = database.collection("BPM");                                                 // Connects to the collection BPM
      req.body["User"] = "Test";
      await collection.insertOne(req.body);                                                          // Uploads the BPM

      res.end("It has been uploaded");                                                               
      console.log(req.body);
    } catch (error) {
      console.error(error.message);
    }
  })

app.get('/heart/:User', async (req, res) => {
    try {
      const database = client.db("Fitbit");                                                          // Connects to the database
      const collection = database.collection("BPM");                                                 // Connects to the collection BPM
      const doc = await collection.findOne(req.params); 
      console.log(doc);
      res.json(doc);
      console.log("done");
    } catch (error) {
    console.error(error.message);
    }
  })

// exports.api = functions.https.onRequest(app)
