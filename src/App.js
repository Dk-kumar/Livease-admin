import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage/homepage";
import Dashboard from "./components/dashboard/dashboard";
import Profile from "./components/profile/Profile";
import UserManagement from "./components/userManagement/userManagement";
import Flat from "./components/flat/flat";
import PropertyOwner from "./components/propertyowner/propertyowner";
import UploadProperty from "./components/uploadproperty/uploadproperty";
import Wallet from "./components/wallet/wallet";
import CreditWallet from "./components/creditwallet/creditwallet";
import SupportTicket from "./components/supportTicket/supportTicket";
import PaymentIssue from "./components/paymentissue/paymentissue";
import ScrapingMod from "./components/scrapingmodule/scrapingmodule";
import MaintenanceService from "./components/maintenanceService/maintenanceService";
import MaintenanceDetails from "./components/maintenanceDetails/maintenanceDetails";
import Provider from "./components/provider/provider";
import Feedback from "./components/feedback/feedback";
import Reminder from "./components/reminder/reminder";
import MarkComplete from "./components/markComplete/markComplete";
import PropertyCheckUps from "./components/PropertyCheckUps/PropertyCheckUps";
import RentalAgreement from "./components/RentalAgreement/RentalAgreement";
import Login from "./components/login/login";

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authToken"); // or any login flag
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login route (accessible without authentication) */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            // <ProtectedRoute>
            <HomePage />
            // </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="tenant-management"
            element={<UserManagement compType={"Tenant"} />}
          />
          <Route
            path="landlord-management"
            element={<UserManagement compType={"Landlord"} />}
          />
          <Route
            path="property-management"
            element={<UserManagement compType={"property"} />}
          />
          <Route path="property/:id" element={<Flat />} />
          <Route path="profile/:id" element={<PropertyOwner />} />
          <Route path="add-property" element={<UploadProperty />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="credit-wallet" element={<CreditWallet />} />
          <Route path="support-ticket" element={<SupportTicket />} />
          <Route path="payment-issue" element={<PaymentIssue />} />
          <Route path="scraping" element={<ScrapingMod />} />
          <Route path="maintenance-service" element={<MaintenanceService />} />
          <Route path="maintenance-details" element={<MaintenanceDetails />} />
          <Route path="provider" element={<Provider />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="reminder" element={<Reminder />} />
          <Route path="mark-complete" element={<MarkComplete />} />
          <Route path="property-checkups" element={<PropertyCheckUps />} />
          <Route path="rental-agreement" element={<RentalAgreement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
