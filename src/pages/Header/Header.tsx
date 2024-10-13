import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./Header.scss";
import { useNavigate } from "react-router-dom";
import { getIndividualProfileAPI } from "../../service/IndividualProfile.service";

const Header: React.FC = () => {
  const [userData, setUserData] = useState<any>(null); // Initialize as null
  const [logoImage, setLogoImage] = useState<string | null>(null); // State for profile logo
  const navigate = useNavigate(); // Use useNavigate hook from react-router-dom

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUserData(parsedUserInfo);
    }

    getIndividualProfileAPI()
      .then((response) => {
        if (response?.status === "success") {
          const profile = response.data;
          setLogoImage(profile.logo_image); // Set only the logo image
        }
      })
      .catch((error) => {
        console.error("Error fetching individual profile:", error);
      });
  }, []);

  const settingPage = () => {
    navigate("/setting");
  }


  return (
    <header className="app-header">
      <div className="logo-container">
        <FontAwesomeIcon icon={faUserCircle} className="logo-icon" />
        <h1 className="logo-text">LAM AI</h1>
      </div>

      <div className="header-right">
        <FontAwesomeIcon icon={faCog} className="icon settings-icon" />

        <div className="profile-info">
          <span>
            {userData?.name ? `Hey ${userData.name}!` : "Welcome to MyteCody!"}
          </span>
          {logoImage ? (
            <img
              src={logoImage}
              alt="Profile"
              className="profile-image" // Display the profile image
            />
          ) : (
            <FontAwesomeIcon icon={faUserCircle} className="icon profile-icon" onClick={settingPage}/>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;