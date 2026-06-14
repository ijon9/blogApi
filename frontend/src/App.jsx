import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Home.jsx"
import Studio from "./Studio.jsx"
import ViewPosts from './ViewPosts.jsx';
import OpenPost from './OpenPost.jsx'

function App() {
  const [count, setCount] = useState(0)

  const router = createBrowserRouter([
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/studio",
        element: <Studio />
      },
      {
        path: "/viewPosts",
        element: <ViewPosts />
      },
      {
        path: "/onePost",
        element: <OpenPost />
      },
    ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
