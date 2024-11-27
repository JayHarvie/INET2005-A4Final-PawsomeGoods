import { Navigate, Outlet } from "react-router-dom";
import Nav from "./ui/Nav";

function App() {

  return (
    <>
          <h1 className="text-center">Pawsome Goods</h1>

          <div>
            <Nav />
          </div>

          <hr />
          <div>
            <Outlet />
          </div>
    </>
  )
}

export default App
