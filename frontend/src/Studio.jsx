import { useState, useEffect } from 'react'

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

function Studio() {    
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
                <label for="pubish">Publish</label>
                <input type="checkbox" id="publish" name="publish" value="true"></input><br/>
                <button type="submit">Submit</button>
            </div>
        </div>
    </>
  )
}

export default Studio
