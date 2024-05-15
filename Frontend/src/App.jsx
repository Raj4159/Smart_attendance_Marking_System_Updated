import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/home/register";
import Login from "./pages/home/Admin_login";
import AdminPanel from "./pages/home/Admin_Panel";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Admin_login" element={<Login />} />
        <Route path="/Admin_Panel" element={<AdminPanel />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
