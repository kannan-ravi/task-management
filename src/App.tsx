import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
