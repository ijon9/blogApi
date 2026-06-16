import { useState, useEffect } from 'react'
import axios, { isCancel, AxiosError } from 'axios';
import { useNavigate } from 'react-router';

function PostStudio({ post }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [yourPost, setYourPost] = useState(post);
  const [deleted, setDeleted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const outerDiv = {
    border: "1px solid black",
  }

  const headerDiv = {
    display: "flex",
    justifyContent: "space-around",
    margin: "10px"
  }

  const bold = {
    fontWeight: "bold",
  }

  const dateObj = new Date(yourPost.date)
  const options = { year: "numeric", month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
  const date2 = dateObj.toLocaleDateString('en-US', options);

  //   function ExpandableCard() {
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <div style={{ border: '1px solid #ccc', padding: '16px' }}>
//       <h3>Component Title</h3>
//       <button onClick={() => setIsExpanded(!isExpanded)}>
//         {isExpanded ? 'Collapse' : 'Expand'}
//       </button>
      
//       {isExpanded && (
//         <div style={{ marginTop: '12px' }}>
//           <p>This is the hidden content that appears when expanded!</p>
//         </div>
//       )}
//     </div>
//   );

  async function updatePost() {
    const t = localStorage.getItem('token');
    const resp = await axios.post(backendURL+'/verifyUser', {token: t});
    
    const loginMsg = resp.data.message;
    if(loginMsg === "Invalid token") {
        alert("Please log in");
        navigate('/');
        return;
    }
    const payload = {
      id: yourPost.p_id,
      title: document.getElementById('title'+yourPost.p_id).value,
      content: document.getElementById('content'+yourPost.p_id).value,
      published: document.getElementById('publish'+yourPost.p_id).checked
    }
    const response = await axios.post(backendURL+'/updatePost', payload);
    const newPost = response.data.updPost;
    setYourPost(prev => ({
      ...prev,
      title: newPost.title,
      content: newPost.content,
      published: newPost.published
    }));
  }

  async function deletePost() {
    const t = localStorage.getItem('token');
    const resp = await axios.post(backendURL+'/verifyUser', {token: t});
    
    const loginMsg = resp.data.message;
    if(loginMsg === "Invalid token") {
        alert("Please log in");
        navigate('/');
        return;
    }
    const pid = yourPost.p_id;
    const response = await axios.post(backendURL+'/deletePost',{pid});
    setDeleted(true);
  }

  async function toggleShowComments() {
    const t = localStorage.getItem('token');
    const resp = await axios.post(backendURL+'/verifyUser', {token: t});
    
    const loginMsg = resp.data.message;
    if(loginMsg === "Invalid token") {
        alert("Please log in");
        navigate('/');
        return;
    }
    const show = !showComments;
    if(show) {
      const comments = await axios.get(backendURL+'/getComments/'+yourPost.p_id);
      setComments(comments.data.comments);
    } else {
      setComments([]);
    }
    setShowComments(show);
  }

  function formatDate(date) {
    const dateObj = new Date(date)
    const options = { year: "numeric", month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    return dateObj.toLocaleDateString('en-US', options);
  }

  async function deleteComment(cid) {
    const t = localStorage.getItem('token');
    const resp = await axios.post(backendURL+'/verifyUser', {token: t});
    
    const loginMsg = resp.data.message;
    if(loginMsg === "Invalid token") {
        alert("Please log in");
        navigate('/');
        return;
    }
    const response = await axios.post(backendURL+'/deleteComment/',{cid});
    const comments = await axios.get(backendURL+'/getComments/'+yourPost.p_id);
    setComments(comments.data.comments);
  }

  return (
    deleted ? null :
    <>
       <div style={outerDiv} >
        <div style={headerDiv}>
            <div>
                <label style={bold} for={"title"+yourPost.p_id}>Title:</label>
                <input style={bold} type="text" defaultValue={yourPost.title} placeholder={yourPost.title} id={"title"+yourPost.p_id} name={"title"+yourPost.p_id}></input>
            </div>
            <div>By: {yourPost.name}</div>
            <div>{date2}</div>
        </div>
         
         <div style={{padding: "10px"}}>
            <label style={bold} for={"content"+yourPost.p_id} >Content:</label><br />
            <textarea defaultValue={yourPost.content} placeholder={yourPost.content} id={"content"+yourPost.p_id} name={"content"+yourPost.p_id} rows="4" cols="100">
            </textarea>
         </div>
         <div>
            <label for={'publish'+yourPost.p_id}>Publish:</label>
            <input defaultChecked={yourPost.published} type="checkbox" id={'publish'+yourPost.p_id} name={'publish'+yourPost.p_id}></input><br/>
         </div>

         {
          showComments 
          ? comments.map((com) => (
           <div key={'postStudio'+com.id}> 
            <strong>{com.name}: </strong>{com.content} <button onClick={() => deleteComment(com.id)}>x</button>
           </div> 
          ))
          : null
         }
         
         <div>
            <button onClick={() => toggleShowComments()}>Toggle Comments</button>
            <button onClick={() => updatePost()}>Save Changes</button>
            <button onClick={() => deletePost()}>Delete Post</button>
         </div>
       </div>
    </>
  )
}

export default PostStudio
