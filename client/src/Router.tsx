import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomeLayout from "./layouts/Home";

import LandingPage from "./pages/Landingpage";
import AccountType from "./pages/home/Type";
import Register from "./pages/home/Register";
import Dashboard from "./pages/Dashboard";

import HomeIndex from "./pages/home/Index";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomeIndex />} />
        </Route>
        <Route>
          <Route path="/type" element={<AccountType />} />
          <Route path="/register/:type" element={<Register />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};
export default App;
