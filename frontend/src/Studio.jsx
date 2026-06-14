import { useState, useEffect } from 'react'
import axios, { isCancel, AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import PostStudio from './PostStudio.jsx'
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
    const [currUser, setCurrUser] = useState({});


    useEffect(() => {
    const grab = async () => {
        const t = localStorage.getItem('token');
        const response = await axios.post(backendURL+'/verifyUser', {token: t});
        const msg = response.data.message;
        if(msg === "Invalid token") {
            alert("Please log in");
            navigate('/');
            return;
        }
        setCurrUser(response.data.user);
        const postsResponse = await axios.get(backendURL+'/viewYourPosts/'+response.data.user.id);
        setYourPosts(postsResponse.data.posts);
    };
    grab();
  }, []);

  

  async function createPost() {
    const t = localStorage.getItem('token');
    const response1 = await axios.post(backendURL+'/verifyUser', {token: t});
    const loginMsg = response1.data.message;
    if(loginMsg === "Invalid token") {
        alert("Please log in");
        navigate('/');
        return;
    }
    const payload = {
      title: document.getElementById('title').value,
      content: document.getElementById('content').value,
      published: document.getElementById('publish').checked,
      token: t,
    }
    const response = await axios.post(backendURL+'/createPost', payload);
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('publish').checked = false;
    const msg = response.data.message;
    
  }

  const postStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "50px"
  }

  return (
    <>
        <div>
            <button onClick={() => {
                navigate('/viewPosts');
            }}>View All Posts</button>
            <button onClick= {() => {
                localStorage.removeItem('token');
                navigate('/');
            }}>Log Out</button>
        </div>
        <h3>Welcome {currUser.name}!</h3>
        <h1 style={{textAlign: "center"}}> Blog Studio </h1>
        <div style={divStyle}>
            <h2 style={headingStyle}>Create new post</h2>
            <div>   
                <label for="title">Title:</label>
                <input type="text" name="title" id="title" required /><br /><br />
                <label for="content">Content:</label><br />
                <textarea id="content" name="content" rows="10" cols="100">
                </textarea><br />
                <label for="publish">Publish</label>
                <input type="checkbox" id="publish" name="publish"></input><br/>
                <button type="submit" onClick={() => createPost()}>Submit</button>
            </div>
        </div>
        <h1 style={{textAlign: "center"}}>Your Posts</h1>
        <div style={postStyle}>
            {yourPosts.map((p) => (
                <PostStudio post={p} key={p.p_id}/>
            ))}
        </div>
    </>
  )
}

export default Studio
