import React, { useContext } from 'react'
import Navbar from '../Components/Navbar/Navbar'
import SideMenu from '../Components/sideMenu/SideMenu'
import { userContext } from '../context/userContext'

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } =useContext(userContext)
  return (
   <div className=''>
    <Navbar activeMenu={activeMenu} />

    {user && (
        <div className='flex'>
            <div className='max-[1800px]:hidden'>
                <SideMenu activeMenu={activeMenu} />
            </div>

            <div className='grow mx-5'>{children}</div>
        </div>
    )}
   </div>
  )
}

export default DashboardLayout;