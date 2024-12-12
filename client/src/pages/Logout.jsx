import React, { useContext, useEffect } from 'react'
import {UserContext} from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(null); // Logout the user
    toast.success("Logout Successfully"); // Show toast once
    navigate('/login'); // Navigate to login page
  }, [setCurrentUser, navigate]); // Empty dependency array to run only once

  return null; // No need for JSX here
};

export default Logout;