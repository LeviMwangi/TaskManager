import React from 'react'
import { Outlet } from 'react-router-dom'

function PrivateRoutes(allowedRoles) {
  return <Outlet />
}

export default PrivateRoutes