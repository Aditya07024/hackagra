const express = require("express");
const router = express.Router();
const multer = require("multer");
const fileController = require("../controllers/fileController");
const ocrController = require("../controllers/ocrController");
const axios = require("axios");

// Memory storage for multer (files won't be saved to disk)
const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

/**
 * @route POST /api/upload
 * @desc Upload file to Cloudinary
 * @body multipart/form-data with "file" field
 */
router.post(
  "/upload",
  upload.single("file"),
  fileController.uploadToCloudinary
);

/**
 * Proxy route for streaming external files (Cloudinary)
 * GET /api/files/proxy?url=<encoded_url>
 */
router.get("/files/proxy", fileController.proxyFile);

/**
 * Proxy PDF route (arraybuffer) — fetches remote PDF and returns bytes
 * GET /api/files/proxy-pdf?url=<encoded-cloudinary-url>
 */
router.get("/files/proxy-pdf", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res
        .status(400)
        .json({ success: false, message: "url query param required" });
    }

    // Basic validation to avoid open proxy abuse
    const allowedHost = "res.cloudinary.com";
    const allowedFolder = "mindverse_uploads";
    let parsed;
    try {
      parsed = new URL(url);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid URL" });
    }

    if (
      !parsed.hostname.includes(allowedHost) ||
      !parsed.pathname.includes(allowedFolder)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "URL not allowed" });
    }

    const upstream = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        ...(req.headers.range ? { Range: req.headers.range } : {}),
        "User-Agent": req.headers["user-agent"] || "hackagra-proxy",
        Accept: "application/pdf, */*",
      },
      validateStatus: (s) => s >= 200 && s < 500,
    });

    if (upstream.status >= 400) {
      return res
        .status(upstream.status)
        .json({ success: false, message: `Upstream error ${upstream.status}` });
    }

    // Force PDF content-type for the response
    res.setHeader("Content-Type", "application/pdf");
    if (upstream.headers["content-length"])
      res.setHeader("Content-Length", upstream.headers["content-length"]);

    return res.status(200).send(Buffer.from(upstream.data));
  } catch (err) {
    console.error("Proxy PDF error:", err?.message || err);
    return res.status(500).json({
      success: false,
      message: "Proxy error",
      error: err?.message || err,
    });
  }
});

/**
 * @route POST /api/files/upload-url
 * @desc Save file URL to database for a specific user
 * @body { userId, filename, fileUrl, fileType, fileSize }
 */
router.post("/files/upload-url", fileController.uploadFileUrl);

/**
 * @route GET /api/files/user/:userId/files
 * @desc Get all files for a specific user
 */
router.get("/files/user/:userId/files", fileController.getUserFiles);

/**
 * @route GET /api/files/user/:userId/stats
 * @desc Get file statistics for a user
 */
router.get("/files/user/:userId/stats", fileController.getFileStats);

/**
 * @route GET /api/files/user/:userId/search?query=filename
 * @desc Search user files by name
 */
router.get("/files/user/:userId/search", fileController.searchUserFiles);

/**
 * @route DELETE /api/files/user/:userId/files/:fileId
 * @desc Delete a specific file for a user
 */
router.delete(
  "/files/user/:userId/files/:fileId",
  fileController.deleteUserFile
);

/**
 * @route POST /api/files/ocr
 * @desc Extract text from image or PDF using OCR
 * @body { fileUrl, fileType, filename }
 */
router.post("/files/ocr", ocrController.extractTextFromFile);

module.exports = router;
