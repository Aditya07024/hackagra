const { spawn } = require("child_process");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const TEMP_DIR = path.join(__dirname, "../../temp_files");
const OCR_MODEL_DIR = path.join(__dirname, "../../..", "ocrModel");

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Download file from Cloudinary URL to local temp directory
 */
const downloadFile = async (url, filename) => {
  try {
    const filepath = path.join(TEMP_DIR, filename);
    const response = await axios.get(url, { responseType: "stream" });

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filepath);
      response.data.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(filepath);
      });
      file.on("error", (err) => {
        fs.unlink(filepath, () => {}); // Delete on error
        reject(err);
      });
    });
  } catch (error) {
    throw new Error(`Failed to download file: ${error.message}`);
  }
};

/**
 * Run Python OCR script via spawn
 */
const runPythonOCR = (scriptPath, filePath) => {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Running OCR script: ${scriptPath} on file: ${filePath}`);

    const pythonProcess = spawn("python3", [scriptPath, filePath], {
      cwd: OCR_MODEL_DIR,
    });

    let stdout = "";
    let stderr = "";

    pythonProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      stderr += data.toString();
      console.error(`[Python stderr]: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed with code ${code}: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });

    pythonProcess.on("error", (err) => {
      reject(new Error(`Failed to spawn Python process: ${err.message}`));
    });
  });
};

/**
 * Extract text from file (Image or PDF)
 * POST /api/files/ocr
 * Body: { fileUrl, fileType, filename }
 */
exports.extractTextFromFile = async (req, res) => {
  const { fileUrl, fileType, filename } = req.body;

  // Validate inputs
  if (!fileUrl || !fileType || !filename) {
    return res.status(400).json({
      success: false,
      message: "fileUrl, fileType, and filename are required",
    });
  }

  // Validate file type
  const isImage = fileType.startsWith("image/");
  const isPdf = fileType === "application/pdf";

  if (!isImage && !isPdf) {
    return res.status(400).json({
      success: false,
      message: "Only images and PDFs are supported",
    });
  }

  let localFilePath;

  try {
    console.log(`📥 OCR request for file: ${filename} (${fileType})`);

    // Step 1: Download file from Cloudinary
    console.log(`⬇️  Downloading file from Cloudinary...`);
    localFilePath = await downloadFile(fileUrl, filename);
    console.log(`✅ File downloaded to: ${localFilePath}`);

    // Step 2: Determine which OCR script to run
    let scriptName;
    if (isImage) {
      scriptName = "tesseract_ocr.py";
    } else if (isPdf) {
      scriptName = "pdf_ocr.py";
    }

    const scriptPath = path.join(OCR_MODEL_DIR, scriptName);

    if (!fs.existsSync(scriptPath)) {
      throw new Error(`OCR script not found: ${scriptPath}`);
    }

    // Step 3: Run OCR
    console.log(`🔍 Running ${scriptName}...`);
    const ocrOutput = await runPythonOCR(scriptPath, localFilePath);

    // Step 4: Clean up temp file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log(`🗑️  Temp file deleted`);
    }

    // Extract text from Python output
    // Python scripts print logs + extracted text, so we parse the output
    const lines = ocrOutput.split("\n");
    const extractedText = lines
      .filter(
        (line) =>
          !line.startsWith("🔍") &&
          !line.startsWith("📄") &&
          !line.startsWith("🔄")
      )
      .join("\n")
      .trim();

    console.log(`✅ OCR completed for: ${filename}`);

    return res.status(200).json({
      success: true,
      message: "OCR extraction successful",
      data: {
        filename,
        fileType,
        extractedText,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ OCR error:", error.message);

    // Clean up temp file on error
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return res.status(500).json({
      success: false,
      message: "OCR processing failed",
      error: error.message,
    });
  }
};
