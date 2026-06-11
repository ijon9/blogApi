import { useState } from 'react'
import axios, { isCancel, AxiosError } from 'axios';

function Home() {

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  async function signUp() {
    const payload = {
      email: document.getElementById('email2').value,
      name: document.getElementById('name2').value,
      password: document.getElementById('password2').value,
    }
    const response = await axios.post(backendURL+'/signUp', payload);
    document.getElementById('email2').value = '';
    document.getElementById('name2').value = '';
    document.getElementById('password2').value = '';
    const message = response.data;
    if(message !== "Success") alert(message);
  }

  async function logIn() {
    const payload = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    }
    const response = await axios.post(backendURL+'/logIn', payload);
    // console.log(response.data);
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  }

  return (
    <>
    <h1> Blog </h1>
    <div>
      <label for="email">Email:</label>
      <input id="email" name="email" placeholder="email" type="text" /><br/>
      <label for="password">Password:</label>
      <input id="password" name="password" type="password" /><br/>
      <button type="submit" onClick={() => logIn()}>Log In</button>
    </div>
    <br/>
    <div>OR:</div>
    <br/>
    <div>
      <label for="email2">Email:</label>
      <input id="email2" name="email2" placeholder="email" type="text" /><br/>
      <label for="name2">Name:</label>
      <input id="name2" name="name2" placeholder="name" type="text" /><br/>
      <label for="password2">Password:</label>
      <input id="password2" name="password2" type="password" /><br/>  
      <button type="submit" onClick={() => signUp()}>Sign Up</button>
    </div>
    
    
    </>
  )
}

export default Home
