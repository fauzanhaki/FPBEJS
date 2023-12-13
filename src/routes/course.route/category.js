const express = require("express");
const router = express.Router();
const multer = require("multer");
const controllers = require("../../controllers/course.controllers/category.controllers");

// Konfigurasi Multer
const storage = multer.memoryStorage(); // Gunakan memory storage untuk menyimpan file di dalam buffer
const upload = multer({ storage: storage });

router.post("/category", upload.single("image"), controllers.create);

module.exports = router;
