const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: './public/images',
  filename: (req, file, cb) => {
    let fileExtension
    if (file.mimetype == "image/png") {
      fileExtension = '.png'
    } else if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      fileExtension = '.jpg'
    }
    let uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage }).single('image'); // Sử dụng tên trường 'file' thay vì 'image'

// Middleware để xử lý việc tải lên ảnh
const uploadImage = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    next();
  });
};

module.exports = {
  uploadImage
};
