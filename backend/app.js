import { prisma } from "./lib/prisma.js";
import express from 'express';
import session from 'express-session'
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

// const express = require("express");
const app = express();

// app.use(session({
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(passport.session());
// app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const users = await prisma.user.findMany({});
    console.log(users);
    res.send(users);
    // res.redirect('https://google.com');
})

// Create post
app.post('/createPost', async (req, res) => {
});

// Create comment

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app - listening on port ${PORT}!`);
});

// Sending post request with fetch
// ================================================================
// async function sendPostRequest() {
//   const url = 'https://typicode.com';
  
//   // Prepare the payload data
//   const payload = {
//     title: 'Hello World',
//     body: 'This is my post content',
//     userId: 1
//   };

//   try {
//     // Initiate the POST request
//     const response = await fetch(url, {
//       method: 'POST', 
//       headers: {
//         'Content-Type': 'application/json' // Instructs the server we are sending JSON data
//       },
//       body: JSON.stringify(payload) // Converts the JS object into a JSON string
//     });

//     // Check if the server responded with a success status (200-299)
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     // Parse and log the JSON response data
//     const responseData = await response.json();
//     console.log('Success:', responseData);

//   } catch (error) {
//     // Catch network failures or parsing errors
//     console.error('Error sending request:', error);
//   }
// }
// ================================================================