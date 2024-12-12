import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  return (
    <>
        <ToastContainer position='top-center' />
        <Header />
        <Outlet />
        <Footer />
    </>
  )
}

export default Layout