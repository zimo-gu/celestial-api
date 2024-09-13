const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(cors()); // Enable CORS for all routes

// Initialize Firebase Admin SDK
const serviceAccount = require('./celestial-rblx-firebase-adminsdk-9nx9j-ac28631918.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://celestial-rblx-default-rtdb.firebaseio.com/' // Replace with your project ID
});

const db = admin.database();

// Your API key (replace with your actual key)
const API_KEY = 'CELESTIAL_AUTH_XhyVjzdctObZqR4wW38UvArAw3osM6Ra'; 

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers.token;

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Token Received' });
  }

  next(); // Proceed to the next middleware or route handler
};

// Define a route to update the 'Approved' field to true (protected by authentication)
app.put('/approve/:name', authenticate, async (req, res) => {
  try {
    const { name } = req.params;

    // Update the 'Approved' field to true
    const updates = {
      Approved: true
    };

    const ref = db.ref("Adverts/" + name);
    await ref.update(updates);

    res.status(200).json({ message: 'Successfully approved Advertisement: ' + name });
  } catch (error) {
    console.error('Error updating data: ', error);
    res.status(500).json({ error: 'An error occured. Please try again later' });
  }
});

// Define a route to update the 'Credits' field to a specified amount (protected by authentication)
app.put('/credits/:userid/:amount', authenticate, async (req, res) => {
    try {
      const { userid, amount } = req.params;
  
      // Update the 'Credits' field
      const updates = {
        Credits: parseInt(amount) // Ensure amount is an integer
      };
  
      const ref = db.ref("Data/" + userid);
      await ref.update(updates);
  
      res.status(200).json({ message: 'Successfully updated Credits for ' + userid + ' to ' + amount });
    } catch (error) {
      console.error('Error updating data: ', error);
      res.status(500).json({ error: 'An error occured. Please try again later' });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
