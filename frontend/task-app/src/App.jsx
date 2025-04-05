import React, { useContext } from 'react'
import { 
  BrowserRouter as 
  Router, 
  Routes, 
  Route, 
  Outlet,
  Navigate} from 'react-router-dom'

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
import UserProvider from './context/userContext'


const App = () => {
  return (
    <div>
      <UserProvider>
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
          {/* Default Route */}
          <Route path='/' element={<Root />} />
        </Routes>
      </Router>
      </UserProvider>
      
    </div>
  )
}

export default App

const Root = () => {
  const { user, loading } = useContext

  if (loading) return <Outlet />

  if (!user) {
    return <Navigate to='/login' />;
  }

  return user.role === 'admin' ? <Navigate to='/admin/dashboard' /> : <Navigate to='/user/dashboard' />
}