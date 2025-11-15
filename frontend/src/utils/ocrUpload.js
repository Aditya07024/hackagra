import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

/**
 * Extract text from image or PDF using OCR
 * @param {string} fileUrl - Cloudinary URL of the file
 * @param {string} fileType - MIME type (image/png, application/pdf, etc.)
 * @param {string} filename - Original filename
 * @returns {Promise<{extractedText, timestamp}>}
 */
export const extractTextViaOCR = async (fileUrl, fileType, filename) => {
  try {
    console.log(`🔍 Starting OCR for: ${filename} (${fileType})`);

    const response = await axios.post(`${API_BASE_URL}/files/ocr`, {
      fileUrl,
      fileType,
      filename,
    });

    if (response.data.success) {
      console.log(`✅ OCR completed for: ${filename}`);
      return response.data.data;
    } else {
      throw new Error(response.data.message || "OCR failed");
    }
  } catch (error) {
    console.error(`❌ OCR error for ${filename}:`, error.message);
    throw error;
  }
};
