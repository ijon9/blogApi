import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Home.jsx"
import Studio from "./Studio.jsx"

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
      // {
      //   path: "/cart",
      //   element: <Cart items={items} cart={cart} editCart={setCart}/>
      // }
    ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
