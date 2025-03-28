const multer = require("multer")

// Configure multer for memory storage
const storage = multer.memoryStorage()

// Create the multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check allowed file types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
    ]

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("File type not allowed"), false)
    }
  },
})

module.exports = { upload }

