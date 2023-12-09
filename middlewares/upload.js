const multer = require("multer");
const path = require("path");
const destination = path.resolve("temp");
const { HttpError } = require("../helpers/HttpError");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}_${file.originalname}`;
    cb(null, filename);
  },
});
const limits = {
  fileSize: 5 * 1024 * 1024,
};
const fileFilter = (req, file, cb) => {
  const extention = file.originalname.split(".").pop();
  if (extention === "exe") { 
    cb(HttpError(400, "Invalid file extention"));
  }
  cb(null, true);
};
const upload = multer({ storage, limits
  , fileFilter
 });

module.exports = { upload };
