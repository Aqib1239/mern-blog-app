import React from 'react'
import { Link } from 'react-router-dom';
import { MdOutlineArrowBack } from "react-icons/md";

const ErrorPage = () => {
  return (
    <section className='error-page'>
      <div className="center">
        <Link to='/' className='btn primary'>
        <span><MdOutlineArrowBack size={20} /> Go Back Home</span>
        </Link>
        <h2>Page Not Found</h2>
      </div>
    </section>
  )
}

export default ErrorPage;