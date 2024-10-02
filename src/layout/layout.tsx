import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "./layout.scss";
import Header from "../pages/Header/Header";
import Navbar from "../pages/Navbar/Navbar";

const Layout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Token check logic (optional)
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      navigate("/login");
    }
  }, [navigate]);

  // Screen size detection logic
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Resize listener

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="layout">
      <Header />
      <div className="layout-content">
        {!isMobile && <Navbar />}
        <main className="layout-main">
          <Outlet /> {/* This will render the routed component */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
