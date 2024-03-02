import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Createroom from "./pages/CreateRoom";
import UpdateRoom from "./pages/UpdateRoom";
import ListingPage from "./pages/ListingPage";
import SaveListing from "./pages/SaveListing";
import Search from "./pages/Search";
import PageNotFound from "./pages/404";
import Message from "./pages/Message";
import SocketConnection from "./components/SocketConnection";
// import Dashboard from "./pages/Dashboard";
import ScrollToTop from "./components/ScrollToTop";
import EmailVerify from "./components/EmailVerify";
import Dashboard from "./dashboard/Dashboard";
import TermCondition from "./pages/TermCondition";
function App() {
  return (
    <BrowserRouter>
      <SocketConnection />
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const { pathname } = useLocation();
  const isDashboardRoute = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboardRoute && <Header />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/listing/:id" element={<ListingPage />} />
        <Route path="/search?" element={<Search />} />
        <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
        <Route path="/create_room" element={<Createroom />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/saved_listing" element={<SaveListing />} />
        <Route path="/termsandconditions" element={<TermCondition />} />
        <Route element={<PrivateRoute />}>
          <Route path="/message" element={<Message />} />
          <Route path="dashboard/*" element={<Dashboard />} />
          <Route path="/update_room/:id" element={<UpdateRoom />} />
        </Route>
      </Routes>
      {!isDashboardRoute && <Footer />}
    </>
  );
}

export default App;
