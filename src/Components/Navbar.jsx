import { useRef, useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navRef = useRef();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
    const isLogged = localStorage.getItem("IsLoggedIn")=== "true";
    setIsLoggedIn(isLogged);
    }
    checkLogin();

    window.addEventListener("login", checkLogin);
    window.addEventListener("logout", checkLogin);
    return () =>{
        window.removeEventListener("login",checkLogin);
        window.removeEventListener("logout",checkLogin);
    }
    
  }, []);

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive-nav");
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.setItem("IsLoggedIn","false")
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("logout"));
    window.location.href = "/signin";
  };

  return (
    <header>
      <h3>Doctor's Point</h3>
      <nav ref={navRef}>
        <Link to="/">Home</Link>
        

        {isLoggedIn ? (
          <>
            <Link to="/records">Records</Link>
            <Link to="/userprofile">Profile</Link>
            <Link to="/consult">Consult</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/signin">SignIn</Link>
            <Link to="/signup">SignUp</Link>
          </>
        )}

        <button className='nav-btn nav-cls' onClick={showNavbar}><FaTimes /></button>
      </nav>
      <button className="nav-btn" onClick={showNavbar}><FaBars /></button>
    </header>
  );
};

export default Navbar;
