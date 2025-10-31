import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center text-light"
      style={{
        background:
          "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
      }}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container"
      >
        <h1 className="display-3 fw-bold mb-3">
          🎟️ Event Ticketing System
        </h1>
        <p className="lead mb-5">
          Your gateway to managing and experiencing amazing events.
        </p>
      </motion.div>

      {/* Card Section */}
      <div className="container">
        <div className="row justify-content-center g-4">
          {/* Admin Login */}
          <motion.div
            className="col-md-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div
              className="card h-100 border-0 shadow-lg text-light"
              style={{
                background:
                  "linear-gradient(135deg, #007bff 0%, #00d4ff 100%)",
                cursor: "pointer",
                borderRadius: "1rem",
              }}
              onClick={() => navigate("/admin/login")}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <i
                  className="bi bi-shield-lock-fill mb-3"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h3 className="fw-bold">Admin Login</h3>
                <p className="text-light-50 mt-2">
                  Manage events, users, and ticket sales.
                </p>
              </div>
            </div>
          </motion.div>

          {/* User Login */}
          <motion.div
            className="col-md-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div
              className="card h-100 border-0 shadow-lg text-light"
              style={{
                background:
                  "linear-gradient(135deg, #28a745 0%, #6ddf79 100%)",
                cursor: "pointer",
                borderRadius: "1rem",
              }}
              onClick={() => navigate("/user/login")}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <i
                  className="bi bi-person-circle mb-3"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h3 className="fw-bold">User Login</h3>
                <p className="text-light-50 mt-2">
                  Explore events and book your tickets easily.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="mt-5 text-light-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p className="mt-4">
          © {new Date().getFullYear()} Event Ticketing System. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
};

export default Home;
