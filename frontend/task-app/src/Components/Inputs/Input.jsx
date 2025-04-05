import React, { useState } from 'react'
import { 
  HiEye,
  HiEyeOff,
} from 'react-icons/hi'

const Input = ({value, onChange, label, placeholder, type}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

  return (
    <div className='relative w-full'>
        <div>
          <label className='font-semibold'>{label} :</label>
            <input
                type={type == 'password' ? showPassword ? 'text' : 'password' : type}
                placeholder={ placeholder }
                className='p-2 rounded border border-gray-600 w-full outline-none'
                value={ value }
                onChange={(e) => onChange(e)}
            />
            
            {type === 'password' && (
              <>
              <div className='absolute -mt-8 right-3 flex items-center cursor-pointer '>
              {showPassword ? (
                  <HiEye 
                    size={22}
                    className='text-blue-600 cursor-pointer'
                    onClick={toggleShowPassword}
                  />
                ) : (
                  <HiEyeOff 
                    size={22}
                    className='text-slate-400 cursor-pointer'
                    onClick={toggleShowPassword}
                  />
                )}
              </div>
              </>
            )}
        </div>
    </div>
  )
}

export default Input