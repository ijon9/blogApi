import { useState, useEffect } from 'react'
import axios, { isCancel, AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import PostHome from './PostHome.jsx'

function ViewPosts() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currUser, setCurrUser] = useState({});
  
  const divStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "50px"
  }

  useEffect(() => {
    const grab = async () => {
        const t = localStorage.getItem('token');
        const resp = await axios.post(backendURL+'/verifyUser', {token: t});
        
        const loginMsg = resp.data.message;
        if(loginMsg === "Invalid token") {
            alert("Please log in");
            navigate('/');
        }
        else {
            setCurrUser(resp.data.user);
            const response = await axios.get(backendURL+'/viewPosts');
            setPosts(response.data.posts);
        }
    };
    grab();
  }, []);



  return (
    <>
      <div>
        <button onClick={() => {
          navigate('/Studio');
        }}>Studio</button>
        <button onClick= {() => {
          localStorage.removeItem('token');
          navigate('/');
        }}>Log Out</button>
      </div>
      <h3>Welcome {currUser.name}!</h3>
      <h1 style={{textAlign: "center"}}>All Posts</h1>
      <div style={divStyle}>
          {posts.map((p, ind) => (
              <PostHome post={p} key={p.p_id}/>
          ))} 
      </div>
    </>
  )
}

export default ViewPosts
