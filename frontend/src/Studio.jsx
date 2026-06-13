import { useState, useEffect } from 'react'
import axios, { isCancel, AxiosError } from 'axios';
import { useNavigate } from 'react-router';
// Create new post section

// Current posts (including comments, published/unpublished)import { useState } from 'react'

const divStyle = {
    border: "1px solid black",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "20px"
}

const headingStyle = {
    marginTop: "0px"
}

const backendURL = import.meta.env.VITE_BACKEND_URL;


function Studio() {
    const [yourPosts, setYourPosts] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
    const grab = async () => {
        const t = localStorage.getItem('token');
        const response = await axios.post(backendURL+'/studio', {token: t});
        const msg = response.data.message;
        if(msg === "Invalid token") {
            alert("Please log in");
            navigate('/');
        }
        else {
            console.log(msg);
        }
    };
    grab();
  }, []);

  

  async function createPost() {
    const payload = {
      title: document.getElementById('title').value,
      content: document.getElementById('content').value,
      published: document.getElementById('publish').checked,
      token: localStorage.getItem("token"),
    }
    const response = await axios.post(backendURL+'/createPost', payload);
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('publish').checked = false;
    const msg = response.data.message;
    if(msg === "Invalid token") {
        alert("Please log in");
        navigate('/');
        return;
    }
  }

  return (
    <>
        <h1 style={{textAlign: "center"}}> Blog Studio </h1>
        <div style={divStyle}>
            <h2 style={headingStyle}>Create new post</h2>
            <div>   
                <label for="title">Title:</label>
                <input type="text" name="title" id="title" required /><br /><br />
                <label for="content">Content:</label><br />
                <textarea id="content" name="content" rows="4" cols="25">
                </textarea><br />
                <label for="publish">Publish</label>
                <input type="checkbox" id="publish" name="publish"></input><br/>
                <button type="submit" onClick={() => createPost()}>Submit</button>
            </div>
        </div>
    </>
  )
}

export default Studio
