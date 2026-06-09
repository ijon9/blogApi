import { useState } from 'react'


function Home() {

  // Use effect which checks if 
  // the user is currently logged in
  // by grabbing locals.user?

  return (
    <>
    <h1> Blog </h1>
    <div>
      <label for="username">Username:</label>
      <input id="username" name="username" placeholder="username" type="text" /><br/>
      <label for="password">Password:</label>
      <input id="password" name="password" type="password" /><br/>
      <button type="submit">Log In</button>
    </div>
    <br/>
    <div>OR:</div>
    <br/>
    <div>
      <label for="username">Username:</label>
      <input id="username" name="username" placeholder="username" type="text" /><br/>
      <label for="password">Password:</label>
      <input id="password" name="password" type="password" /><br/>  
      <button type="submit">Sign Up</button>
    </div>
    
    
    </>
  )
}

export default Home
