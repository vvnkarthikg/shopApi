import React, { useState } from 'react';
import './ImageUpload.css'; // Import CSS for styling
import no from '../images/no.jpg';


const ImageUpload = ({ onImageChange }) => {
    const [imagePreview, setImagePreview] = useState(''); // State for image preview

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // Create a URL for the image preview
            onImageChange(file); // Pass the selected file to parent component
        }
    };

    return (
        <div className="upload-section">
            {/* Displaying Image Preview or Placeholder */}


            {!imagePreview ? (
                <img src={no} alt="Preview" className="image-preview" />
            ) : (
                <img src={imagePreview} alt="Preview" className="image-preview" />
            )}
            <label htmlFor="file-upload" className="custom-file-upload">
                Upload Image
            </label>
            <input 
                id="file-upload"
                type="file" 
                accept="image/png, image/jpeg" 
                onChange={handleImageChange} 
                className="file-input" /* Custom class for styling */
            />
        </div>
    );
};

export default ImageUpload;