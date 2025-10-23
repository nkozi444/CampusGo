import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminHome from "./AdminHome";
import HomeScreen from "./HomeScreen"; // ✅ this points to your landing page (index.tsx)
import Loginpage from "./Loginpage"; // make sure filename matches exactly
import SuperAdminHome from "./SuperAdminHome";
import UserHome from "./UserHome";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<HomeScreen />} />

        {/* Authentication */}
        <Route path="/login" element={<Loginpage />} />

        {/* User Dashboards */}
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/superadminhome" element={<SuperAdminHome />} />

        {/* 404 Fallback */}
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
