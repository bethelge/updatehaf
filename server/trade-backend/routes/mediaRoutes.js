const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const authenticateToken = require('../middleware/auth'); 
const multer = require('multer');
const path = require('path');

// Upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


router.post("/", authenticateToken, upload.single('media'), mediaController.createMedia);
router.get("/", mediaController.getAllMedia);
router.delete("/:id", authenticateToken, mediaController.deleteMedia);
router.put("/:id", authenticateToken, upload.single('media'), mediaController.updateMedia);


module.exports = router;
