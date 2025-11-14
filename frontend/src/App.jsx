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
import Profile from "./pages/Profile"; 
import Settings from "./pages/Settings";

import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import ManageEvents from "./pages/ManageEvents";
import Tickets from "./pages/Tickets";
import AdminProfile from "./pages/AdminProfile";
import AdminSettings from "./pages/AdminSettings";


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
        <Route path="my-tickets" element={<MyTickets />} />
        <Route path="payments" element={<Payments />} />
        <Route path="my-qr-codes" element={<MyQRCodes />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/*Admin routes with layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="users" element={<Users />} /> 
        <Route path="add-user" element={<AddUser />} />
        <Route path="manage-events" element={<ManageEvents />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
