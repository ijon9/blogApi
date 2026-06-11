import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Home.jsx"
import Studio from "./Studio.jsx"
import ViewPosts from './ViewPosts.jsx';

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
    ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
