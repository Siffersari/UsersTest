import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { logout } from '../../services/userService';
import { decryptString } from '../../utils/encyrptString';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const encryptedToken = sessionStorage.getItem('jwtToken');
    if (encryptedToken) {
      const token = decryptString(encryptedToken);
      setIsLoggedIn(!!token);
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.usrFirstname && user.usrLastname) {
      setUserName(`${user.usrFirstname} ${user.usrLastname}`);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-kcbDarkBlue text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold">
          KCB Bank
        </Link>
        <ul className="flex space-x-4 items-center">
          {isLoggedIn ? (
            <>
              <div className="relative">
                <button 
                  className="flex items-center space-x-2"
                  onClick={toggleDropdown}
                >
                  <FaUserCircle size={24} />
                  <span>{userName}</span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <li>
              <Link to="/login" className="hover:text-kcbGreen">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
