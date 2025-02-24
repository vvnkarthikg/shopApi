//passwords must be encrypted, so use bcrypt
//bcrypt operation is irreversible

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const checkAuth = require('../middlewares/check-auth');
const User = require("../models/user");
const upload = require('../multerConfig');


// User Signup
router.post("/signup", (req, res) => {
  const { email, password, firstName, lastName, storeName, gstNumber, address } = req.body;

  if (!email || !password || !firstName || !lastName || !storeName || !gstNumber || !address || !phoneNumber) {
    return res.status(400).json({ message: "Provide all required details" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({ message: 'Error hashing password' });
    }

    const newUser = new User({
      email,
      password: hash,
      firstName,
      lastName,
      storeName,
      gstNumber,
      address
    });

    newUser
      .save()
      .then(() => {
        res.status(201).json({ message: 'User created successfully' });
      })
      .catch((err) => {
        if (err.code === 11000) { // MongoDB duplicate key error code
          return res.status(409).json({ message: 'Email already exists' });
        }
        console.log(err);
        res.status(500).json({ error: 'Error saving user' });
      });
  });
});

// User Signin
router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Provide the required details" });
  }

  User.findOne({ email }) // Changed to findOne for better performance
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Email not found' });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error comparing passwords' });
        }
        if (!result) {
          return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({
          userId: user._id,
          isAdmin: user.isAdmin
        }, process.env.JWT_KEY, { expiresIn: "1h" });

        return res.status(200).json({
          message: "Signed in successfully",
          token,
          isAdmin: user.isAdmin
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    });
});

// Get User Profile
router.get('/profile', checkAuth, async (req, res) => {
  try {
    const userId = req.userData.userId; // Assuming you have middleware that sets this
    const userProfile = await User.findById(userId).select('-password'); // Exclude password from response

    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userProfile); // Return the entire profile excluding password

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update User Details
router.patch('/', checkAuth, upload.single('profileImage'), async (req, res) => {
  try {
    // Log the incoming request body
    console.log('Incoming request body:', req.body);

    const { updateFields } = req.body;

    // Ensure updateFields is not empty
    if (!updateFields && !req.file) {
      console.log('No fields provided for update');
      return res.status(400).json({ message: "Provide details to update" });
    }

    // Process file upload if there’s an uploaded file
    if (req.file) {
      updateFields.profileImage = req.file.path; // Save the file path in the profileImage field
    }

    // Log the fields to be updated
    console.log('Fields to be updated:', updateFields);

    // Find the user by ID and update specified fields
    const updatedUser = await User.findByIdAndUpdate(
      req.userData.userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log('User not found with ID:', req.userData.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the updated user data excluding sensitive information
    const { password, ...userData } = updatedUser.toObject(); // Exclude password
    console.log('Updated user data:', userData);

    res.status(200).json({ message: 'User updated successfully', user: userData });

  } catch (error) {
    console.error('Error updating user:', error); // Log error for debugging
    res.status(500).json({ message: error.message });
  }
});

// Delete User by Email
router.delete('/', checkAuth, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Provide the required details" });
    }

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ message: 'User deleted successfully' });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Delete User by ID
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).send({ message: 'User not found', id });
    }

    res.status(200).send({ message: 'User deleted successfully', id });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;