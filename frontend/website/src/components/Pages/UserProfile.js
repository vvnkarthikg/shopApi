import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageUpload from './ImageUpload';
import './UserProfile.css';

const UserProfile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [storeName, setStoreName] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [address, setAddress] = useState({
        doorNo: '',
        street: '',
        landmark: '',
        area: '',
        mandal: '',
        district: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Fetched User Profile:', response.data);
                const { firstName, lastName, phone, email, storeName, gstNumber, address } = response.data;

                setFirstName(firstName || '');
                setLastName(lastName || '');
                setPhone(phone || '');
                setEmail(email || '');
                setStoreName(storeName || '');
                setGstNumber(gstNumber || '');
                if (address) {
                    setAddress({
                        doorNo: address.doorNo || '',
                        street: address.street || '',
                        landmark: address.landmark || '',
                        area: address.area || '',
                        mandal: address.mandal || '',
                        district: address.district || ''
                    });
                }
            } catch (err) {
                console.log('Error fetching user profile:', err);
                setError('Failed to load user profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleImageChange = (file) => {
        console.log('Selected file:', file);
        setSelectedFile(file);
    };

    const uploadImage = async (file) => {
        // Assume you have an API endpoint for image upload and get a URL in response.
        // Implement the logic here to upload `file` and return the URL.
        return "uploaded-image-url"; // Placeholder for uploaded image URL.
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let profilePicUrl = "";
        if (selectedFile) {
            profilePicUrl = await uploadImage(selectedFile);
        }

        const updateFields = {
            firstName,
            lastName,
            email,
            phone,
            storeName,
            gstNumber,
            profilepic: profilePicUrl,
            address: {
                doorNo: address.doorNo,
                street: address.street,
                landmark: address.landmark,
                area: address.area,
                mandal: address.mandal,
                district: address.district
            }
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/user/`,
                updateFields,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Response:', response);
            alert('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
            alert(errorMessage);
        }
    };

    const handleCancel = () => {
        console.log('Edit cancelled.');
        setIsEditing(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="user-profile-container">
            <h3 className="user-profile-header">User Profile</h3>
            <div className="user-profile-form-layout">
                <div className="user-profile-upload-section">
                    <ImageUpload onImageChange={handleImageChange} />
                </div>
                <form className="user-profile-details-section" onSubmit={handleSubmit}>
                    <h3>Personal Details</h3>
                    <div className="user-profile-field-row">
                        <div className="user-profile-field">
                            <label>First Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            ) : (
                                <span className="user-profile-value">{firstName || "Please fill this"}</span>
                            )}
                        </div>
                        <div className="user-profile-field">
                            <label>Last Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            ) : (
                                <span className="user-profile-value">{lastName || "Please fill this"}</span>
                            )}
                        </div>
                    </div>

                    <div className="user-profile-field-row">
                        <div className="user-profile-field">
                            <label>Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                />
                            ) : (
                                <span className="user-profile-value">{email || "Please fill this"}</span>
                            )}
                        </div>
                        <div className="user-profile-field">
                            <label>Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            ) : (
                                <span className="user-profile-value">{phone || "Please fill this"}</span>
                            )}
                        </div>
                    </div>

                    <h3>Store Details</h3>
                    <div className="user-profile-field">
                        <label>Store Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                            />
                        ) : (
                            <span className="user-profile-value">{storeName || "Please fill this"}</span>
                        )}
                    </div>
                    <div className="user-profile-field">
                        <label>GST Number</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={gstNumber}
                                onChange={(e) => setGstNumber(e.target.value)}
                            />
                        ) : (
                            <span className="user-profile-value">{gstNumber || "Please fill this"}</span>
                        )}
                    </div>

                    <h3>Address</h3>
                    <div className="user-profile-field-row">
                        <div className="user-profile-field">
                            <label>Door Number</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={address.doorNo}
                                    onChange={(e) => setAddress({ ...address, doorNo: e.target.value })}
                                />
                            ) : (
                                <span className="user-profile-value">{address.doorNo || "Please fill this"}</span>
                            )}
                        </div>
                        <div className="user-profile-field">
                            <label>Street</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={address.street}
                                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                />
                            ) : (
                                <span className="user-profile-value">{address.street || "Please fill this"}</span>
                            )}
                        </div>
                    </div>

                    {Object.entries(address).filter(([key]) => !['doorNo', 'street'].includes(key)).map(([key, value]) => (
                        <div className="user-profile-field" key={key}>
                            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                                />
                            ) : (
                                <span className="user-profile-value">{value || "Please fill this"}</span>
                            )}
                        </div>
                    ))}

                     {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="user-profile-edit-button">
                        Edit Profile
                    </button>
                )}

                    {isEditing && (
                      <div className="user-profile-actions">
                          <button type="submit">Save</button>
                          <button type="button" onClick={handleCancel}>Cancel</button>
                      </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
