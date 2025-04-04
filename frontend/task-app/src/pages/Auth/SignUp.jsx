import React, { useState } from 'react'
import image2 from '../../assets/images/signUp.jpg'
import Input from '../../Components/Inputs/Input';
import { 
  FaSquareXTwitter,
  FaFacebook,
  FaInstagram,
  FaRedditAlien 
} from "react-icons/fa6";
import { validateEmail } from '../../Utils/helper';
const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, settFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const [adminInviteToken, setAdminInviteToken] = useState('')
  const [error, setError] = useState(null);
  //Handle Sign Up Form Submit
    const handleSignUp = async (e) => {
      e.preventDefault();
  
      if(!fullName) {
        setError('Please enter your name')
        return;
      }

      if(!validateEmail(email)) {
            setError('Please enter valid email')
            return;
      }

      if(!password) {
        setError('Please enter the password')
        return;
      }
-p
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      setError('');
    }
  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-[#7ad3f62a] flex rounded-2xl shadow-lg max-w-4xl w-full sm:flex-row flex-col">
        {/* Left Section */}
        <div className="relative sm:w-1/2 h-full hidden sm:flex flex-col justify-center items-center">
            <div className='absolute text-white text-center'>
              <h2 className='text-4xl font-extrabold mb-20 '>Welcome Back</h2>
              <p className='text-xl font-semibold'>Please enter your details to login 
                <br />
                to your admin or user dashboard: 
              </p>
              <div className='flex justify-between mt-50'>
                <FaFacebook 
                  size={30}
                  className='cursor-pointer hover:text-black transition-all 5s ease-in-out'
                />
                <FaInstagram 
                  size={30}
                  className='cursor-pointer  hover:text-black transition-all 5s ease-in-out'
                />
                <FaRedditAlien 
                  size={30}
                  className='cursor-pointer hover:text-black transition-all 5s ease-in-out'
                />
                <FaSquareXTwitter 
                  size={30}
                  className='cursor-pointer hover:text-black transition-all 5s ease-in-out'
                />
              </div>
            </div>
            <img src={ image2 } alt='login image' className='rounded-2xl'/>
        </div>
        {/* Right Section */}
        <div className="sm:w-1/2 w-full px-8 py-4 flex flex-col justify-center items-center">
        <h2 className="font-bold text-2xl text-[#4527a5] text-center mb-3">
            Sign Up
          </h2>
          <p className="text-sm text-[#6c57b1] text-opacity-70 text-center mb-7">
            Not a member, sign up below:
          </p>
          <form className="flex flex-col gap-4 w-full max-w-sm" onClick={handleSignUp}>

          </form>
        </div>
      </div>
    </section>
  )
}

export default SignUp