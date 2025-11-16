import React, { useState, useEffect } from 'react';
import { FaPlus, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ReviewForm from '../ReviewForm/ReviewForm'; // Import the ReviewForm component
import api from '../../utils/api'; // Import the API utility
import Loading from '../Loading/Loading'; // Assuming you have a Loading component
import toast from 'react-hot-toast'; // Corrected import: use react-hot-toast

// Removed dummy seniorProfiles data

const ConnectToSeniors = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [seniors, setSeniors] = useState([]); // State to store fetched senior profiles
  const [loading, setLoading] = useState(true); // Loading state
  const [filterSubject, setFilterSubject] = useState('');
  const [filterMinMarks, setFilterMinMarks] = useState('');
  const [filterMaxMarks, setFilterMaxMarks] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false); // State for modal visibility
  const [selectedSeniorId, setSelectedSeniorId] = useState(null); // State to hold the ID of the senior being reviewed

  useEffect(() => {
    const fetchSeniors = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/seniors');
        setSeniors(response.data.data);
      } catch (error) {
        console.error('Error fetching senior profiles:', error);
        toast.error('Failed to load senior profiles.');
      } finally {
        setLoading(false);
      }
    };
    fetchSeniors();
  }, []);

  const filteredSeniors = seniors.filter((profile) => {
    const matchesSubject = filterSubject
      ? profile.seniorSubjects.some((s) => // Changed from profile.subjects to profile.seniorSubjects
          s.subject.toLowerCase().includes(filterSubject.toLowerCase())
        )
      : true;

    const matchesMarks =
      (filterMinMarks === '' ||
        profile.seniorSubjects.some((s) => parseInt(s.marks) >= parseInt(filterMinMarks))) && // Parse marks for comparison
      (filterMaxMarks === '' ||
        profile.seniorSubjects.some((s) => parseInt(s.marks) <= parseInt(filterMaxMarks))); // Parse marks for comparison

    return matchesSubject && matchesMarks;
  });

  const handleGiveReviewClick = (seniorId) => {
    setSelectedSeniorId(seniorId);
    setShowReviewForm(true);
  };

  const handleReviewSubmitted = () => {
    // Re-fetch senior profiles to update average ratings and review list
    const fetchSeniors = async () => {
      try {
        const response = await api.get('/users/seniors');
        setSeniors(response.data.data);
      } catch (error) {
        console.error('Error fetching senior profiles after review:', error);
        toast.error('Failed to refresh senior profiles.');
      } finally {
        setShowReviewForm(false);
        setSelectedSeniorId(null);
      }
    };
    fetchSeniors();
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
    setSelectedSeniorId(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-blue-900/50 text-gray-900 dark:text-white">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <span className="text-3xl mr-2">🧑‍🎓</span>
          <h1 className="text-3xl font-bold">Connect to Seniors</h1>
        </div>
      </header>

      <button
        onClick={() => navigate('/add-senior-profile')}
        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md mb-8"
      >
        <FaPlus className="mr-2" />
        Add Your Senior Profile
      </button>

      {/* Filter Section */}
      <div className="mb-8 p-4 bg-white dark:bg-blue-900/50 rounded-lg shadow-lg flex flex-wrap gap-4 items-center border border-gray-200 dark:border-blue-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Seniors:</h3>
        <input
          type="text"
          placeholder="Filter by Subject"
          className="flex-1 px-3 py-2 bg-gray-100 dark:bg-blue-800 border border-gray-300 dark:border-blue-700 rounded-md shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Marks"
          className="w-32 px-3 py-2 bg-gray-100 dark:bg-blue-800 border border-gray-300 dark:border-blue-700 rounded-md shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
          value={filterMinMarks}
          onChange={(e) => setFilterMinMarks(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Marks"
          className="w-32 px-3 py-2 bg-gray-100 dark:bg-blue-800 border border-gray-300 dark:border-blue-700 rounded-md shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
          value={filterMaxMarks}
          onChange={(e) => setFilterMaxMarks(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {filteredSeniors.map((profile) => (
          <div key={profile.id} className="bg-white dark:bg-blue-900/50 rounded-lg p-6 flex items-center space-x-6 shadow-lg border border-gray-200 dark:border-blue-700">
            <img
              src={profile.image}
              alt={profile.username}
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">{profile.username}</h2>
              {/* Displaying multiple subjects and their marks */}
              <div className="text-blue-600 dark:text-blue-400 text-sm mb-1">
                {profile.seniorSubjects.map((subjectData, index) => (
                  <p key={index}>
                    {subjectData.subject}: {subjectData.marks}
                  </p>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-1"><strong>Description:</strong> {profile.seniorDescription}</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-1"><strong>Availability:</strong> {profile.availability || 'Not specified'}</p>
              <div className="flex items-center text-yellow-500 dark:text-yellow-400 text-sm mb-2">
                <FaStar className="mr-1" />
                <span>{profile.averageRating ? profile.averageRating.toFixed(1) : 'No ratings'}</span>
              </div>
              <a
                href={profile.connectionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 px-3 rounded-lg shadow-md text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.933 8-11 8S1 16.418 1 12 5.933 4 12 4s11 3.582 11 8z"></path>
                </svg>
                Connect
              </a>
              <button
                onClick={() => handleGiveReviewClick(profile.id)}
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 rounded-lg shadow-md text-sm ml-2"
              >
                Give Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {showReviewForm && (
        <ReviewForm
          seniorId={selectedSeniorId}
          onReviewSubmitted={handleReviewSubmitted}
          onClose={handleCloseReviewForm}
        />
      )}
    </div>
  );
};

export default ConnectToSeniors;
