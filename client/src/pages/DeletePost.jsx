import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const DeletePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const {id} = useParams();

  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;

  // redirect to login page for any user who is not logged in
  useEffect(() => {
    if(!token) {
      navigate('/login');
    }
  },[token, navigate]);

  const removePost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, { withCredentials: true, headers: {Authorization: `Bearer ${token}`}});
      if(response.status === 200) {
        if(location.pathname === `/myposts/${currentUser.id}`){
          navigate(0);
        } else {
          navigate('/');
          toast.success(response.data.message);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  if(isLoading) {
    return <Loader />;
  }

  return (
    <Link className='btn sm danger' onClick={removePost}>Delete</Link>
  )
}

export default DeletePost