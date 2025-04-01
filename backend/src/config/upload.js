const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Resolve the absolute path for the upload directory
const uploadDir = path.resolve("public/uploads/");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const Upload = multer({ storage });

// Export upload middleware
module.exports = Upload
