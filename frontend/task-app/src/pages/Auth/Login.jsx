import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image1 from '../../assets/images/login.jpg';
import Input from '../../Components/Inputs/Input';
import { 
  FaSquareXTwitter,
  FaFacebook,
  FaInstagram,
  FaRedditAlien 
} from "react-icons/fa6";
import { validateEmail } from '../../Utils/helper';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPath';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate email and password
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (!password) {
      setError('Please enter the password');
      return;
    }

    setError('');

    //Login API call
  try { 
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });

    const { token, role } = response.data;

    if (token) {
      localStorage.setItem('token', token);

      //Redirect based on roll
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    }
  } catch (error) {
    if (error.response && error.response.data.message) {
      setError(error.response.data.message);
    } else {
      setError('Something went wrong. Please try again.')
    }
  }
};
  
  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-[#7ad3f62a] flex rounded-2xl shadow-lg max-w-4xl w-full sm:flex-row flex-col">
        {/* Left Section */}
        <div className="relative sm:w-1/2 h-full hidden sm:flex flex-col justify-center items-center">
          <div className="absolute text-white text-center">
            <h2 className="text-4xl font-extrabold mb-20">Welcome Back</h2>
            <p className="text-xl font-semibold">
              Please enter your details to login <br /> to your admin or user dashboard:
            </p>
            <div className="flex justify-between mt-50">
              <FaFacebook 
                size={30}
                className="cursor-pointer hover:text-black transition-all 5s ease-in-out"
              />
              <FaInstagram 
                size={30}
                className="cursor-pointer hover:text-black transition-all 5s ease-in-out"
              />
              <FaRedditAlien 
                size={30}
                className="cursor-pointer hover:text-black transition-all 5s ease-in-out"
              />
              <FaSquareXTwitter 
                size={30}
                className="cursor-pointer hover:text-black transition-all 5s ease-in-out"
              />
            </div>
          </div>
          <img src={image1} alt="login" className="rounded-2xl" />
        </div>
        {/* Right Section */}
        <div className="sm:w-1/2 w-full px-8 py-4 flex flex-col justify-center items-center">
          <h2 className="font-bold text-2xl text-[#4527a5] text-center mb-3">Login</h2>
          <p className="text-sm text-[#6c57b1] text-opacity-70 text-center mb-7">
            If you already are a member, easily log in
          </p>
          <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleLogin}>
            <Input 
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="Type your email here"
              type="text"
            />
            <Input 
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
            
            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-xs mt-2">
                {error}
              </p>
            )}

            <button className="bg-blue-500 rounded-xl text-white py-2 hover:bg-blue-600 cursor-pointer" type="submit">
              Login
            </button>
          </form>
          <div className="mt-10 grid grid-cols-3 items-center text-gray-400 w-full max-w-sm">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>
          <p className="mt-5 text-xs border-b border-gray-400 py-4 text-center flex gap-1.5">
            Don't have an account?{" "}
            <Link to="/signUp">
              <span className="text-blue-600 underline cursor-pointer">Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
