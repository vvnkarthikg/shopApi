// multerConfig.js


//multer

//file object after parsing
/*
{
  "fieldname": "profilePic", //name of the input tag of file
  "originalname": "avatar.png",//real name of file
  "encoding": "7bit",
  "mimetype": "image/png",
  "size": 34567,
  "destination": "./assets/images",
  "filename": "2024-10-02T12-15-30.123Zavatar.png",
  "path": "assets/images/2024-10-02T12-15-30.123Zavatar.png" //path after saving
}

 */


const multer = require('multer');
const path = require('path');

// Configure storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'api/Images'); // Define your destination path here
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
    // Allow only specific file types
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Export the multer instance with storage and filter settings
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
