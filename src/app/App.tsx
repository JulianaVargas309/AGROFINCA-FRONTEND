import { RouterProvider } from "react-router-dom"
import { appRouter } from "@/router"
import { Providers } from "./providers"

function App() {
  return (
    <Providers>
      <RouterProvider router={appRouter} />
    </Providers>
  )
}

export default App
