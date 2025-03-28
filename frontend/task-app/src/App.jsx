import React from 'react'
import { 
  BrowserRouter as 
  Router, 
  Routes, 
  Route } from 'react-router-dom'
// import { 
//   HiMoon,
//   HiEye,
//   HiEyeOff,
//   HiOutlineLogin,
//   HiOutlineLogout
// } from 'react-icons/hi'

import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Dashboard from './pages/Admin/Dashboard'
import PrivateRoutes from './routes/PrivateRoutes'
import ManageTask from './pages/Admin/ManageTask'
import CreateTask from './pages/Admin/CreateTask'
import UserDash from './pages/user/UserDash'
import MyTask from './pages/user/MyTask'
import ViewTaskDetails from './pages/user/ViewTaskDetails'
import ManageUsers from './pages/Admin/ManageUsers'


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoutes allowedRoles={["admin"]}/>}>
            <Route path='/admin/dashboard' element={<Dashboard />} />
            <Route path='/admin/tasks' element={<ManageTask />} />
            <Route path='/admin/create-task' element={<CreateTask />} />
            <Route path='/admin/users' element={<ManageUsers />} />
          </Route>

          {/* user routes */}
          <Route element={<PrivateRoutes allowedRoles={['admin']} />}>
            <Route path='/user/dashboard' element={<UserDash />} />
            <Route path='/user/tasks' element={<MyTask />} />
            <Route path='/user/task-details/:id' element={<ViewTaskDetails />} /> 
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App