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
<<<<<<< HEAD
import KintoConnect from "./pages/kinto/KintoConnect";
import RecoverWallet from "./pages/kinto/RecoverWallet";
import AccountInfoPage from "./pages/kinto/AccountInfoPage"
=======
import KintoConnect from "./pages/kinto/kintoconnect";
// import ProjectBudget from "./pages/kinto/ProjectBudget";
// import SignProtocol from "./pages/dashboard/SignProtocol"
>>>>>>> 1969b661dc46c8fd7345c1ffb6d27cab04de955e

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
          <Route path="/kinto/KintoConnect" element={<KintoConnect />} />
<<<<<<< HEAD
          <Route path="/kinto/RecoverWallet" element={<RecoverWallet/>} />
          <Route path="/kinto/AccountInfoPage" element={<AccountInfoPage/>} />
=======
          {/* <Route path="/kinto/ProjectBudget" element={<ProjectBudget/>} /> */}
>>>>>>> 1969b661dc46c8fd7345c1ffb6d27cab04de955e
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
