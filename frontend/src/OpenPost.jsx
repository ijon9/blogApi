import { useState, useEffect } from 'react'
import axios, { isCancel, AxiosError } from 'axios';
import { useNavigate, useLocation } from 'react-router';

function OpenPost() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const location = useLocation();
  const { post } = location.state || {};

  useEffect(() => {
    const grab = async () => {
      const t = localStorage.getItem('token');
      const response = await axios.post(backendURL+'/verifyUser', {token: t});
      
      const loginMsg = response.data.message;
      if(loginMsg === "Invalid token") {
          alert("Please log in");
          navigate('/');
          return;
      }
      const response2 = await axios.get(backendURL+'/getComments/'+post.p_id);
      setComments(response2.data.comments);
    };
    grab();
  }, []);

  const dateObj = new Date(post.date)
  const options = { year: "numeric", month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
  const date2 = dateObj.toLocaleDateString('en-US', options);

  async function addComment(p_id) {
    const t = localStorage.getItem('token');
    const response1 = await axios.post(backendURL+'/verifyUser', {token: t});
    const loginMsg = response1.data.message;
    if(loginMsg === "Invalid token") {
        alert("Please log in");
        navigate('/');
        return;
    }
    const payload = {
      content: document.getElementById("comment").value,
      p_id,
      token: t
    }
    const response = await axios.post(backendURL+'/createComment', payload);
    document.getElementById("comment").value = '';
    const response2 = await axios.get(backendURL+'/getComments/'+post.p_id);
    setComments(response2.data.comments);
  }

  function formatDate(date) {
    const dateObj = new Date(date)
    const options = { year: "numeric", month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    return dateObj.toLocaleDateString('en-US', options);
  }

  return (
    <>
       <div>
        <button onClick={() => {
          navigate('/viewPosts');
        }}>View Posts</button>
        <button onClick={() => {
          navigate('/studio');
        }}>Studio</button>
        <button onClick= {() => {
          localStorage.removeItem('token');
          navigate('/');
        }}>Log Out</button>
        <div>
            <div><h1 style={{margin: "0px"}}>{post.title}</h1></div>
            <div>By: {post.name}</div>
            <div>{date2}</div>
        </div>
         
         <p style={{overflowWrap: "break-word"}}>
            {post.content}
         </p>

         <h2>Comments</h2>
         {comments.map((com, ind) => (
              <p key={"openPost"+com.id}><strong>{com.name}:</strong> {com.content} at <strong>{formatDate(com.date)}</strong></p>
          ))} 

        <div style={{padding: "10px"}}>
          <label for="">Comment:</label>
          <input id="comment" name="comment" type="text" />
          <button type="submit" onClick={() => addComment(post.p_id)}>Add Comment</button>
        </div>
       </div>
    </>
  )
}

export default OpenPost
