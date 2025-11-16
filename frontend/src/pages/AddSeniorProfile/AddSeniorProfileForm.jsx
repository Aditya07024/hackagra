import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import { FaPlus } from 'react-icons/fa'; // Import FaPlus for the add subject button

const AddSeniorProfileForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from auth context
  const [seniorSubjects, setSeniorSubjects] = useState([{ subject: '', marks: '' }]); // For multiple subjects and marks
  const [seniorDescription, setSeniorDescription] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [availability, setAvailability] = useState(''); // New state for availability
  const [connectionLink, setConnectionLink] = useState(''); // New state for connection link
  const [loading, setLoading] = useState(false);

  const handleSubjectChange = (index, e) => {
    const newSubjects = [...seniorSubjects];
    newSubjects[index][e.target.name] = e.target.value;
    setSeniorSubjects(newSubjects);
  };

  const addSubjectField = () => {
    setSeniorSubjects([...seniorSubjects, { subject: '', marks: '' }]);
  };

  const removeSubjectField = (index) => {
    const newSubjects = [...seniorSubjects];
    newSubjects.splice(index, 1);
    setSeniorSubjects(newSubjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user || !user.id) {
        toast.error('User not authenticated.');
        setLoading(false);
        return;
      }
      const userId = user.id;

      await api.put(`/users/senior-profile`, { // Removed userId from URL
        seniorSubjects, // Send the array of subjects and marks
        seniorDescription,
        profilePictureUrl,
        availability,
        connectionLink,
      });

      toast.success('Senior profile added successfully!');
      navigate('/connect-to-seniors'); // Navigate back to the senior profiles list
    } catch (error) {
      console.error('Error adding senior profile:', error);
      toast.error(error.response?.data?.message || 'Failed to add senior profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Add Your Senior Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="seniorSubjects" className="block text-sm font-medium text-gray-300 mb-2">Subject Specialties & Marks</label>
            {seniorSubjects.map((subjectData, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  name="subject"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                  placeholder="Subject (e.g., Mathematics)"
                  value={subjectData.subject}
                  onChange={(e) => handleSubjectChange(index, e)}
                  required
                />
                <input
                  type="text"
                  name="marks"
                  className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                  placeholder="Marks (e.g., 95%)"
                  value={subjectData.marks}
                  onChange={(e) => handleSubjectChange(index, e)}
                  required
                />
                {seniorSubjects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubjectField(index)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSubjectField}
              className="mt-2 flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              <FaPlus className="mr-1" /> Add Another Subject
            </button>
          </div>
          <div>
            <label htmlFor="seniorDescription" className="block text-sm font-medium text-gray-300">Description / Bio</label>
            <textarea
              id="seniorDescription"
              rows="4"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
              placeholder="Tell us about your experience and how you can help..."
              value={seniorDescription}
              onChange={(e) => setSeniorDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-300">Profile Picture URL</label>
            <input
              type="text"
              id="profilePictureUrl"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
              placeholder="e.g., https://example.com/your-image.jpg"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-300">Availability to Connect</label>
            <input
              type="text"
              id="availability"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
              placeholder="e.g., Mon, Wed, Fri (3-5 PM)"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="connectionLink" className="block text-sm font-medium text-gray-300">Connection Link</label>
            <input
              type="text"
              id="connectionLink"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
              placeholder="e.g., https://linkedin.com/in/yourprofile"
              value={connectionLink}
              onChange={(e) => setConnectionLink(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Add Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSeniorProfileForm;
