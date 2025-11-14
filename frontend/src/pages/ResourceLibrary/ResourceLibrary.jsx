import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import Loading from '../../components/Loading/Loading';
import { FiFileText, FiDownload } from 'react-icons/fi';

export default function ResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await api.get('/resources'); // Assuming a /resources API endpoint
        setResources(response.data);
      } catch (err) {
        setError('Failed to fetch resources.');
        console.error('Error fetching resources:', err);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-blue-bg flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="w-full p-6 bg-dark-blue-bg min-h-screen">
      <h1 className="text-white text-3xl font-bold mb-6">📚 Resource Library</h1>

      {resources.length === 0 && (
        <div className="text-center py-12">
          <FiFileText className="w-16 h-16 text-dark-blue-text-light mx-auto mb-4" />
          <p className="text-dark-blue-text-light text-lg">No resources uploaded yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(resource => (
          <div key={resource._id} className="bg-dark-blue-card p-4 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-white text-xl font-bold mb-2">{resource.title}</h3>
              <p className="text-dark-blue-text-light text-sm mb-4">{resource.description || 'No description provided.'}</p>
              {resource.type && <p className="text-dark-blue-text-light text-xs">Type: {resource.type}</p>}
              {resource.uploadedAt && <p className="text-dark-blue-text-light text-xs">Uploaded: {new Date(resource.uploadedAt).toLocaleDateString()}</p>}
            </div>
            <div className="mt-4 flex justify-end">
              <a
                href={resource.url} // Assuming resource object has a 'url' for download
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-light transition font-semibold flex items-center"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
