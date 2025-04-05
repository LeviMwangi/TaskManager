import React, { useRef, useState, useEffect } from 'react';
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        // Cleanup the object URL when the component unmounts or image changes
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Update image state
            setImage(file);

            // Generate preview URL from the file
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    const onChooseFile = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
    
    return (
        <div className='flex justify-center mb-6'>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className='hidden'
            />
            {!image ? (
                <div className='w-20 h-20 flex items-center justify-center bg-blue-300/50 rounded-full relative cursor-pointer'>
                    <LuUser className='text-4xl text-blue-700' />
                    <button
                        type='button'
                        className='w-8 h-8 flex items-center justify-center text-white bg-blue-700 rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                        onClick={onChooseFile}
                    >
                        <LuUpload />
                    </button>
                </div>
            ) : (
                <div className='relative'>
                    <img
                        src={previewUrl}
                        alt='profile photo'
                        className='w-20 h-20 rounded-full object-cover'
                    />
                    <button
                        type='button'
                        onClick={handleRemoveImage}
                        className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1'
                    >
                        <LuTrash />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;
