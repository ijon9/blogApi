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
  origin: process.env.FRONTEND_URL,
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
      INNER JOIN
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
      SELECT p.id AS p_id, u.name, p.title, p.content, p.date, p.published
      FROM "User" u
      INNER JOIN
      "Post" p ON u.id = p.authorid
      WHERE u.id = ${userId}
      ORDER BY p.date desc
    `;
    return res.send({message: "Your posts retrieved", posts});
  } catch(e) {
    return res.send({message: "Invalid query" });
  }
})

app.post('/updatePost', async(req, res) => {
  const payload = req.body;
  try {
    const updPost = await prisma.post.update({
      where: {id: payload.id},
      data: { title: payload.title, content: payload.content, published: payload.published}
    });
    return res.send({message: "Your post updated", updPost});
  } catch(e) {
    return res.send({message: "Invalid query" });
  }
})

app.post('/deletePost', async(req, res) => {
  const pid = req.body.pid;
  try {
    const deleteComments = await prisma.comment.deleteMany({
      where: { postId: pid }
    });
    const delPost = await prisma.post.delete({
      where: { id : pid }
    });
    return res.send({ message: "Your post deleted", delPost });
  } catch(e) {
    return res.send({message: "Invalid query" });
  }
})

app.post('/deleteComment', async(req, res) => {
  const cid = req.body.cid;
  try {
    const deleteComment = await prisma.comment.delete({
      where: {
        id: cid,
      }
    })
    return res.send({ message: "Comment deleted", deleteComment});
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
      INNER JOIN "Comment" c
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
    if(payload.content === '' || payload.title === '') throw new Error();
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
    if(payload.content === '') throw new Error();
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
    if(payload.password === '' || payload.email === '' || payload.name === '') throw new Error("Empty field");
    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: hashed,
        name: payload.name
      }
    });
  } catch(e) {
    if(e.message === "Empty field") return res.send("Empty field");
    return res.send("Email already exists");
  }
  
  res.send("Success");
})

const PORT = process.env.PORT || 3000;;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app - listening on port ${PORT}!`);
});