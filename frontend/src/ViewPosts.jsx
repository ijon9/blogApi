import { useState, useEffect } from 'react'
import axios, { isCancel, AxiosError } from 'axios';
import { useNavigate } from 'react-router';

function ViewPosts() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const grab = async () => {
        const t = localStorage.getItem('token');
        if(t === null) {
            alert("Please log in");
            navigate('/');
        }
        else {
            const response = await axios.post(backendURL+'/viewPosts', {token: t});
            const msg = response.data.message;
            if(msg === "Invalid token") {
                alert("Please log in");
                navigate('/');
            }
            else {
                setPosts(["Alice", "Bob", "Cat"]);
                console.log(msg);
            }
        }
    };
    grab();
  }, []);



  return (
    <>
        {/* {posts.map((p, ind) => (
            <h1>{p}</h1>
        ))} */}
        <div>Rendered</div>
    </>
  )
}

export default ViewPosts
