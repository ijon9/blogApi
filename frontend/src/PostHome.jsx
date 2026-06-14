import { useState, useEffect } from 'react'
import axios, { isCancel, AxiosError } from 'axios';
import { useNavigate } from 'react-router';

function PostHome({ post }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const outerDiv = {
    border: "1px solid black",
    cursor: "pointer"
  }

  const headerDiv = {
    display: "flex",
    justifyContent: "space-around",
    margin: "10px"
  }

  const dateObj = new Date(post.date)
  const options = { year: "numeric", month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
  const date2 = dateObj.toLocaleDateString('en-US', options);

  return (
    <>
       <div style={outerDiv} onClick={() => {
          navigate('/onePost', { state: { post }});
       }}>
        <div style={headerDiv}>
            <div><h2 style={{margin: "0px"}}>{post.title}</h2></div>
            <div>By: {post.name}</div>
            <div>{date2}</div>
        </div>
         
         <p style={{padding: "10px"}}>
            {post.content}
         </p>
       </div>
    </>
  )
}

export default PostHome
