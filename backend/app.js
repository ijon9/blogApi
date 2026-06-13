import { prisma } from "./lib/prisma.js";
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { jwtDecode } from "jwt-decode";

const secretKey = "secret1329487239";

// npx prisma studio --config ./prisma.config.js


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

// Get posts
// SELECT p.id AS p_id, u.name, p.title, p.content, p.date 
//   FROM "User" u
// LEFT JOIN
//   "Post" p ON u.id = p.authorid
// WHERE p.published

// Get comments
// SELECT u.name, c.content, c.date, c.id
// FROM "User" u
// LEFT JOIN "Comment" c
// ON c.authorid = u.id
// WHERE c."postId" = 2
app.post('/viewPosts', async(req, res) => {
  const payload = req.body;
  const token = payload.token;
  try {
    const decoded = jwt.verify(token, secretKey);
    const posts = await prisma.$queryRaw`
      SELECT p.id AS p_id, u.name, p.title, p.content, p.date 
      FROM "User" u
      LEFT JOIN
      "Post" p ON u.id = p.authorid
      WHERE p.published
      ORDER BY p.date desc
    `;
    return res.send({message: "Success", posts});
  }
  catch(e) {
    return res.send({message: "Invalid token"});
  }
})

// Studio
app.post('/studio', async(req, res) => {
  const payload = req.body;
  const token = payload.token;
  try {
    const decoded = jwt.verify(token, secretKey);
    return res.send({message: "Success"});
  }
  catch(e) {
    return res.send({message: "Invalid token"});
  }
})

// Create post
app.post('/createPost', async (req, res) => {
  const payload = req.body;
  const token = payload.token;
  try {
    const decoded = jwt.verify(token, secretKey);
    const user = jwtDecode(token);
    const post = await prisma.post.create({
      data: {
        title: payload.title,
        content: payload.content,
        authorid: user.id,
        published: payload.published
      }
    });
    return res.send({message: "Success", post});
  }
  catch(e) {
    return res.send({message: "Invalid token"});
    
  }
});

// TEST JWT
// app.post('/testJwt', async(req, res) => {
//   try {
//     const bearerHeader = req.headers['authorization'];
//     // Check if bearer is undefined
//     if(typeof bearerHeader !== 'undefined') {
//         // Split at the space
//         const bearer = bearerHeader.split(' ');
//         // Get token from array
//         const token = bearer[1];
//         // Set the token
//         const decoded = jwt.verify(token, secretKey);
//         console.log(decoded);
//         res.send("Success");
//     }
//   }
//   catch(e) {
//     res.send("Invalid token");
//   }
// })

// Login
app.post('/logIn', async (req, res) => {
  const payload = req.body;
  const user = await prisma.user.findUnique({
    // where: { email: payload.email },
    where: { email: payload.email },
  })
  if(!user) {
    return res.send({ message: "Incorrect email" });
  }
  const match = await bcrypt.compare(payload.password, user.password);
  if(!match) {
    return res.send( { message: "Incorrect password" });
  }
  const token = jwt.sign(user, secretKey, {expiresIn: "1h" });
  return res.send( { message: "Success", token: token} );
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