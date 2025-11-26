import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/authorize/Auth";
import DashboardLayout from "./component/Layout";
import './App.css'
import { useState } from "react";

function App() {
 const [userData, setUserData] = useState(() => {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  });

  const isLoggedIn = !!userData;

  return (
    <BrowserRouter>
      <Routes>
        {/* Trang login */}
        <Route
          path="/login"
          element={!isLoggedIn ? <Auth /> : <Navigate to="/home" replace />}
        />

        {/* Dashboard (sau khi login) */}
        <Route
          path="/*"
          element={isLoggedIn ? <DashboardLayout onLogout={() => setUserData(null)} /> : <Navigate to="/login" replace />}
        />

        {/* Redirect mặc định */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
