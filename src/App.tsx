import { BrowserRouter, Routes, Route } from "react-router-dom";
import Booth from "./pages/Booth";
import Home from "./pages/Home";
import Result from "./pages/Result";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Policy from "./pages/Policy";
import Photos from "./pages/Photos";
function App () {
  return (<>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/result" element={<Result/>}></Route>
      <Route path="/booth" element={<Booth />}></Route>
      <Route path="/About" element={<About />}></Route>
      <Route path="/Policy" element={<Policy />}></Route>
      <Route path="/Photos" element={<Photos />}></Route>
      <Route path="/Contact" element={<Contact />}></Route>

      <Route path="*" element={<NotFound/>}></Route>
    </Routes>
  </BrowserRouter>
  </>)
}

export default App;