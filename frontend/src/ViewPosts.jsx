import { useState, useEffect } from 'react'
import axios, { isCancel, AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import PostHome from './PostHome.jsx'

function ViewPosts() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const grab = async () => {
        const t = localStorage.getItem('token');
        const response = await axios.post(backendURL+'/viewPosts', {token: t});
        const msg = response.data.message;
        if(msg === "Invalid token") {
            alert("Please log in");
            navigate('/');
        }
        else {
            setPosts(response.data.posts);
            console.log(response.data.posts);
        }
    };
    grab();
  }, []);



  return (
    <>
        <h1 style={{textAlign: "center"}}>All Posts</h1>
        {posts.map((p, ind) => (
            <PostHome post={p} key={p.p_id}/>
        ))}
    </>
  )
}

export default ViewPosts
