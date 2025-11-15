import { useState, useEffect } from "react";
import api from "../../utils/api";
import {
  uploadToCloudinary,
  saveFileUrlToDatabase,
  getUserFiles,
} from "../../utils/cloudinaryUpload";
import { extractTextViaOCR } from "../../utils/ocrUpload";
import toast from "react-hot-toast";
import Loading from "../../components/Loading/Loading";
import {
  FiUpload,
  FiCopy,
  FiTrash2,
  FiFileText,
  FiExternalLink,
  FiZap,
} from "react-icons/fi";
import PDFViewer from "../../components/PDFViewer.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

export default function Summarizer() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  // Load user ID
  useEffect(() => {
    const storedUserId =
      localStorage.getItem("userId") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.id ||
      "demo-user";

    setUserId(storedUserId);
  }, []);

  // Fetch user files
  useEffect(() => {
    if (userId) fetchUserFiles();
  }, [userId]);

  const fetchUserFiles = async () => {
    try {
      const response = await getUserFiles(userId);

      if (response.success && Array.isArray(response.data)) {
        setUserFiles(response.data);
      } else {
        setUserFiles([]);
      }
    } catch (e) {
      console.error("❌ File fetch error", e);
      setUserFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleFileUpload = async () => {
    if (!file) return toast.error("Please select a file");

    setUploading(true);
    try {
      const cloudUrl = await uploadToCloudinary(file);

      await saveFileUrlToDatabase(
        userId,
        file.name,
        cloudUrl,
        file.type,
        file.size
      );

      toast.success("File uploaded!");

      setFile(null);
      const input = document.querySelector('input[type="file"]');
      if (input) input.value = "";

      await fetchUserFiles();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.fileUrl);
    toast.success("Copied!");
  };

  const handleOCR = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    // Only support images and PDFs
    if (
      !selectedFile.fileType?.startsWith("image/") &&
      selectedFile.fileType !== "application/pdf"
    ) {
      toast.error("Only images and PDFs are supported for OCR");
      return;
    }

    setOcrLoading(true);
    try {
      console.log(`🔍 Starting OCR for: ${selectedFile.filename}`);
      const result = await extractTextViaOCR(
        selectedFile.fileUrl,
        selectedFile.fileType,
        selectedFile.filename
      );

      setOcrResult(result);
      toast.success("OCR completed!");
    } catch (error) {
      console.error("❌ OCR error:", error);
      toast.error(`OCR failed: ${error.message}`);
    } finally {
      setOcrLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!confirm("Delete this file?")) return;

    try {
      const res = await api.delete(`/files/user/${userId}/files/${fileId}`);

      if (res.data.success) {
        toast.success("Deleted");
        await fetchUserFiles();
        if (selectedFile?.id === fileId) {
          setSelectedFile(null);
          setOcrResult(null);
        }
      }
    } catch {
      toast.error("Error deleting file");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Smart Summarizer
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= LEFT PANEL ================= */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Box */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Upload File</h2>

              <div className="border-2 border-dashed p-6 rounded-lg text-center">
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />

                <label className="cursor-pointer">
                  <span className="font-semibold">Click to upload</span>
                  <p className="text-xs text-gray-500">or drag & drop</p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                  />
                </label>
              </div>

              {file && (
                <div className="mt-4 bg-blue-50 p-3 rounded">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs">{formatFileSize(file.size)}</p>
                </div>
              )}

              <button
                onClick={handleFileUpload}
                disabled={!file || uploading}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
              >
                {uploading ? "Uploading..." : "Upload File"}
              </button>
            </div>

            {/* ================= Upload History ================= */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
              <h3 className="text-xl font-bold mb-4">Upload History</h3>

              {userFiles.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {userFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`p-4 rounded border cursor-pointer ${
                        selectedFile?.id === file.id
                          ? "bg-blue-50 border-blue-500"
                          : "bg-gray-50 hover:border-blue-500"
                      }`}
                    >
                      <h4 className="font-semibold truncate">
                        {file.filename}
                      </h4>
                      <p className="text-xs">
                        {formatDate(file.uploadedAt)} •{" "}
                        {formatFileSize(file.fileSize)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8">No files yet.</p>
              )}
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Details / Preview */}
            {selectedFile ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedFile.filename}
                    </h2>
                    {/* <p className="text-sm mt-2">
                      {formatDate(selectedFile.uploadedAt)}
                    </p>
                    <p className="text-sm">
                      {formatFileSize(selectedFile.fileSize)}
                    </p> */}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                      title="Copy URL"
                    >
                      <FiCopy />
                    </button>

                    <button
                      onClick={handleOCR}
                      disabled={
                        ocrLoading ||
                        (selectedFile.fileType !== "application/pdf" &&
                          !selectedFile.fileType?.startsWith("image/"))
                      }
                      className="p-2 bg-purple-200 text-purple-600 rounded hover:bg-purple-300 disabled:bg-gray-300 transition"
                      title="Extract text using OCR"
                    >
                      <FiZap />
                    </button>

                    <a
                      href={selectedFile.fileUrl}
                      target="_blank"
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                      title="Open in new tab"
                    >
                      <FiExternalLink />
                    </a>

                    <button
                      onClick={() => handleDelete(selectedFile.id)}
                      className="p-2 bg-red-200 text-red-600 rounded hover:bg-red-300 transition"
                      title="Delete file"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                {/* <div className="bg-gray-50 p-4 rounded mt-4">
                  <p className="text-sm font-semibold">File URL:</p>
                  <p className="text-xs break-all text-blue-600 mt-1">
                    {selectedFile.fileUrl}
                  </p>
                </div> */}

                <div className="mt-6">
                  {selectedFile.fileType?.startsWith("image/") && (
                    <img
                      src={selectedFile.fileUrl}
                      className="w-full max-h-[600px] rounded shadow object-contain"
                    />
                  )}

                  {selectedFile.fileType === "application/pdf" && (
                    <PDFViewer
                      url={`${API_BASE_URL}/files/proxy-pdf?url=${encodeURIComponent(
                        selectedFile.fileUrl
                      )}`}
                    />
                  )}

                  {!selectedFile.fileType?.startsWith("image/") &&
                    selectedFile.fileType !== "application/pdf" && (
                      <div className="p-4 mt-4 bg-gray-100 rounded-lg text-center">
                        <p>No preview available</p>
                        <a
                          href={selectedFile.fileUrl}
                          target="_blank"
                          className="text-blue-600 underline mt-2 inline-block"
                        >
                          Open File
                        </a>
                      </div>
                    )}
                </div>

                {/* OCR Results */}
                {ocrResult && (
                  <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded shadow-md mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <FiZap className="text-purple-600" />
                        OCR Results
                      </h3>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            ocrResult.extractedText
                          );
                          toast.success("Text copied to clipboard!");
                        }}
                        className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      >
                        Copy Text
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                      Extracted at:{" "}
                      {new Date(ocrResult.timestamp).toLocaleString()}
                    </p>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded max-h-96 overflow-y-auto whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                      {ocrResult.extractedText || "No text extracted"}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-12 rounded shadow text-center">
                <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p>Select a file to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
