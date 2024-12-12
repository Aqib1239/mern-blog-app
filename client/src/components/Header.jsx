import React, { useContext, useState } from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { RiMenu3Fill } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from "../context/userContext";
import { FaRegUser } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { CiLogin } from "react-icons/ci";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(
    window.innerWidth > 800 ? true : false
  );
  const { currentUser } = useContext(UserContext);
  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavOpen(false);
    } else {
      setIsNavOpen(true);
    }
  };

  return (
    <nav>
      <div className="container nav_container">
        <Link to="/" className="nav_logo" onClick={closeNavHandler}>
          <img src={Logo} alt="" />
        </Link>

        {currentUser?.id && isNavOpen && (
          <ul className="nav_menu">
            <li>
              <Link to={`/profile/${currentUser.id}`} onClick={closeNavHandler}>
                <FaRegUser size={16} /> {currentUser?.name}
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={closeNavHandler} >
                <IoCreateOutline size={18} /> <span>Create Post</span>
              </Link>
            </li>
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                <RiAdminLine size={18} /> Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeNavHandler}>
                <CiLogout size={20} /> Logout
              </Link>
            </li>
          </ul>
        )}

        {!currentUser?.id && isNavOpen && (
          <ul className="nav_menu">
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                <RiAdminLine size={18} /> Authors
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeNavHandler}>
                <CiLogin size={20} /> Login
              </Link>
            </li>
          </ul>
        )}
        <button
          className="nav_toggle-btn"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          {isNavOpen ? <AiOutlineClose size={25} /> : <RiMenu3Fill size={25} />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
