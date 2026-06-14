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

// Verify User
app.post('/verifyUser', async(req, res) => {
  const token = req.body.token;
  try {
    const decoded = jwt.verify(token, secretKey);
    return res.send({message: "Success", user: jwtDecode(token)});
  } catch(e) {
    return res.send({message: "Invalid token"});
  }
})

app.get('/viewPosts', async(req, res) => {
  try {
    const posts = await prisma.$queryRaw`
      SELECT p.id AS p_id, u.name, p.title, p.content, p.date 
      FROM "User" u
      LEFT JOIN
      "Post" p ON u.id = p.authorid
      WHERE p.published
      ORDER BY p.date desc
    `;
    return res.send({message: "Posts retrieved", posts});
  }
  catch(e) {
    return res.send({message: "Invalid query"});
  }
})

app.get('/viewYourPosts/:id', async(req, res) => {
  try {
    const userId = req.params.id;
    const posts = await prisma.$queryRaw`
      SELECT p.id AS p_id, u.name, p.title, p.content, p.date 
      FROM "User" u
      LEFT JOIN
      "Post" p ON u.id = p.authorid
      WHERE p.published AND u.id = ${userId}
      ORDER BY p.date desc
    `;
    return res.send({message: "Your posts retrieved", posts});
  } catch(e) {
    return res.send({message: "Invalid query" });
  }
})

app.get('/getComments/:id', async (req, res) => {
  const p_id = req.params.id;
  try {
    const comments = await prisma.$queryRaw`
      SELECT u.name, c.content, c.date, c.id
      FROM "User" u
      LEFT JOIN "Comment" c
      ON c.authorid = u.id
      WHERE c."postId" = ${p_id}
      ORDER BY c.date ASC
    `;
    return res.send({message: "Comments retrieved", comments})
  } catch(e) {
    return res.send({message: "Invalid query"});
  }
  
})

// Studio
app.post('/studio', async(req, res) => {
})

// Create post
app.post('/createPost', async (req, res) => {
  const payload = req.body;
  const token = payload.token;
  try {
    const user = jwtDecode(token);
    const post = await prisma.post.create({
      data: {
        title: payload.title,
        content: payload.content,
        authorid: user.id,
        published: payload.published
      }
    });
    return res.send({message: "Post created", post});
  }
  catch(e) {
    return res.send({message: "Invalid query"});
    
  }
});

// Create comment
app.post('/createComment', async (req, res) => {
  const payload = req.body;
  const token = payload.token;
  try {
    const user = jwtDecode(token);
    const comment = await prisma.comment.create({
      data: {
        authorid: user.id,
        content: payload.content,
        postId: payload.p_id,
      }
    });
    return res.send({ message: "Comment created", comment });
  } catch(e) {
    return res.send({ message: "Invalid query" });
  }
})

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

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app - listening on port ${PORT}!`);
});