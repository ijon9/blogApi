import { useState, useEffect } from 'react'
import axios, { isCancel, AxiosError } from 'axios';
import { useNavigate } from 'react-router';

function PostStudio({ post }) {
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

  const bold = {
    fontWeight: "bold",
  }

  const dateObj = new Date(post.date)
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

  return (
    <>
       <div style={outerDiv} >
        <div style={headerDiv}>
            <div>
                <label style={bold} for={"title"+post.id}>Title:</label>
                <input style={bold} type="text" defaultValue={post.title} placeholder={post.title} id={"title"+post.id} name={"title"+post.id}></input>
            </div>
            <div>By: {post.name}</div>
            <div>{date2}</div>
        </div>
         
         <div style={{padding: "10px"}}>
            <label style={bold} for={"content"+post.id} >Content:</label><br />
            <textarea defaultValue={post.content} placeholder={post.content} id={"content"+post.id} name={"content"+post.id} rows="4" cols="100">
            </textarea>
         </div>
         <div>
            <button>Show Comments</button>
            <button>Save Changes</button>
         </div>
       </div>
    </>
  )
}

export default PostStudio
