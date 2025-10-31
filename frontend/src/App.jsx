import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import UserLayout from "./pages/UserLayout";
import UserDashboard from "./pages/UserDashboard";
import Events from "./pages/Events";
import TicketBooking from "./pages/TicketBooking";
import CardPayment from "./pages/CardPayment";
import Payments from "./pages/Payments";
import TicketSuccess from "./pages/TicketSuccess";
import MyTickets from "./pages/MyTickets";
import MyQRCodes from "./pages/MyQRCodes";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />

      {/* User routes with layout */}
      <Route path="/user" element={<UserLayout />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="ticket-booking" element={<TicketBooking />} />
        <Route path="events" element={<Events />} />
        <Route path="card-payment" element={<CardPayment />} />
        <Route path="ticket-success" element={<TicketSuccess />} />
        <Route path="mytickets" element={<MyTickets />} />
        <Route path="payment" element={<Payments />} />
        <Route path="myqrcodes" element={<MyQRCodes />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
