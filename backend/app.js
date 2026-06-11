import { prisma } from "./lib/prisma.js";
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs'

// const express = require("express");
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', async (req, res) => {
    const users = await prisma.user.findMany({});
    console.log(users);
    res.send(users);
    // res.redirect('https://google.com');
})

// Create post
app.post('/createPost', async (req, res) => {
});

// Login
app.post('/logIn', async (req, res) => {
  const payload = req.body;
  const user = await prisma.user.findUnique({
    // where: { email: payload.email },
    where: { email: payload.email },
  })
  if(!user) {
    return res.send("Incorrect email");
  }
  const match = await bcrypt.compare(payload.password, user.password);
  if(!match) {
    return res.send("Incorrect password");
  }
  return res.send("Success");
});

// Create comment
// Sign up
app.post('/signUp', async (req, res) => {
  const payload = req.body;
  const hashed = await bcrypt.hash(payload.password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: hashed,
        name: payload.name
      }
    });
  } catch(e) {
    res.send("Email already exists");
  }
  
  res.send("Success");
})

// import { jwtDecode } from "jwt-decode";

// const token = localStorage.getItem("token");
// if (token) {
//     const user = jwtDecode(token);
//     console.log(user.name); // Accessing token properties
// }

// Log in

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