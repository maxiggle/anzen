import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomeLayout from "./layouts/Home";
import DashboardLayout from "./layouts/Dashboard";

import AuthType from "./pages/home/Type";
import Register from "./pages/home/Register";

import HomeIndex from "./pages/home/Index";
import DashboardIndex from "./pages/dashboard/Index";
import DashboardContract from "./pages/dashboard/Contract";
import DashboardInvoices from "./pages/dashboard/Invoices";
import DashboardSupport from "./pages/dashboard/Support";
import DashboardSettings from "./pages/dashboard/Settings";
import DashboardChat from "./pages/dashboard/Chat";
import EmployeeDashBoard from "./pages/dashboard/Employeedashboard";
import KintoConnect from "./pages/kinto/KintoConnect";
// import ProjectBudget from "./pages/kinto/ProjectBudget";
// import SignProtocol from "./pages/dashboard/SignProtocol"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomeIndex />} />
        </Route>
        <Route>
          <Route path="/type" element={<AuthType />} />
          <Route path="/register/:type" element={<Register />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardIndex />} />
          <Route path="/dashboard/chats" element={<DashboardChat />} />
          <Route path="/dashboard/contracts" element={<DashboardContract />} />
          <Route path="/dashboard/invoices" element={<DashboardInvoices />} />
          <Route path="/dashboard/support" element={<DashboardSupport />} />
          <Route path="/dashboard/settings" element={<DashboardSettings />} />
          <Route path="/dashboard/employee" element={<EmployeeDashBoard />} />
          <Route path="/kinto/KintoConnect" element={<KintoConnect/>} />
          {/* <Route path="/kinto/ProjectBudget" element={<ProjectBudget/>} /> */}
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
