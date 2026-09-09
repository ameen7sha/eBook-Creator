const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = "uploads";
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive: true});
}

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, uploadDir);
    },
    filename: function (req, file, cb){
        cb(null, 
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    }
});

function checkFileType(file, cb) {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (allowedExtensions.includes(extension)) {
        return cb(null, true);
    }

    cb(new Error("Images only!"));
}

const upload = multer({
    storage: storage,
    limits: {fileSize: 2*1024*1024},
    fileFilter: function (req, file, cb){
        checkFileType(file, cb);
    },
}).single("coverImage");

module.exports = upload;