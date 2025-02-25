const path = require('path');
const multer = require('multer');
const fs = require('fs');
const publicPath = require('path').resolve('public');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(publicPath + "/files/projects")) {
            fs.mkdirSync(publicPath + "/files/projects", { recursive: true });
        }
        // const uploadPath = path.join(__dirname, '../public/files/projects');
        const uploadPath = publicPath + "/files/projects";
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = `file-${Date.now()}${ext}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage });

const uploadSingleFile = upload.single('file');

module.exports = uploadSingleFile;
