import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading/Loading';
import { FiUpload, FiCopy, FiDownload, FiTrash2, FiFileText } from 'react-icons/fi';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function Summarizer() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMindMap, setShowMindMap] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const res = await api.get('/summarizer');
      setSummaries(res.data);
    } catch (error) {
      toast.error('Failed to fetch summaries');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/summarizer/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('File processed successfully!');
      setSelectedSummary(res.data);
      fetchSummaries();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process file');
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = (summary) => {
    const blob = new Blob([summary.summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.filename}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this summary?')) return;
    try {
      await api.delete(`/summarizer/${id}`);
      toast.success('Summary deleted');
      if (selectedSummary?._id === id) setSelectedSummary(null);
      fetchSummaries();
    } catch (error) {
      toast.error('Failed to delete summary');
    }
  };

  const generateMindMap = (summary) => {
    const sentences = summary.summary.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const newNodes = [
      { id: '1', data: { label: summary.filename }, position: { x: 250, y: 50 }, type: 'input' },
    ];
    const newEdges = [];

    sentences.slice(0, 5).forEach((sentence, idx) => {
      const nodeId = `${idx + 2}`;
      const words = sentence.trim().split(' ').slice(0, 5).join(' ');
      newNodes.push({
        id: nodeId,
        data: { label: words },
        position: { x: (idx % 3) * 200, y: 150 + Math.floor(idx / 3) * 100 },
      });
      newEdges.push({ id: `e1-${nodeId}`, source: '1', target: nodeId });
    });

    setNodes(newNodes);
    setEdges(newEdges);
    setShowMindMap(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Smart Summarizer</h1>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, or Image (MAX. 10MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          {uploading && (
            <div className="mt-4 text-center">
              <Loading />
              <p className="text-gray-600 dark:text-gray-400 mt-2">Processing file...</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Summary Display */}
          <div className="lg:col-span-2">
            {selectedSummary ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedSummary.filename}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(selectedSummary.summary)}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      title="Copy"
                    >
                      <FiCopy />
                    </button>
                    <button
                      onClick={() => handleDownload(selectedSummary)}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      title="Download"
                    >
                      <FiDownload />
                    </button>
                    <button
                      onClick={() => generateMindMap(selectedSummary)}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    >
                      Generate Mind Map
                    </button>
                  </div>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedSummary.summary}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Select a summary from history to view</p>
              </div>
            )}
          </div>

          {/* History Sidebar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">History</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {summaries.map((summary) => (
                <div
                  key={summary._id}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    selectedSummary?._id === summary._id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedSummary(summary)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {summary.filename}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(summary.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(summary._id);
                      }}
                      className="p-1 text-red-600 hover:text-red-700 transition"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
              {summaries.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No summaries yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mind Map Modal */}
        {showMindMap && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-[600px] p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mind Map</h2>
                <button
                  onClick={() => setShowMindMap(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

