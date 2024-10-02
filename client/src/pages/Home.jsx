import React from 'react'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <>
    <div>home page</div>
    <Outlet/>
    </>
  )
}

export default Home