import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import Loading from '../../components/Loading/Loading';
import { FiUser, FiMessageCircle, FiBookOpen, FiPlus } from 'react-icons/fi';

export default function ConnectToSeniors() {
  const [seniors, setSeniors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddSeniorModal, setShowAddSeniorModal] = useState(false);
  const [newSenior, setNewSenior] = useState({
    name: '',
    subjectExpertise: '',
    bio: '',
    avatar: '',
  });

  useEffect(() => {
    const fetchSeniors = async () => {
      try {
        setLoading(true);
        // Mock data for seniors
        const mockSeniors = [
          {
            _id: "1",
            name: "Alice Johnson",
            subjectExpertise: "Mathematics, Physics",
            bio: "Passionate about problem-solving and helping others excel in STEM fields.",
            avatar: "https://i.pravatar.cc/150?img=1",
          },
          {
            _id: "2",
            name: "Bob Williams",
            subjectExpertise: "Computer Science, Data Structures",
            bio: "Experienced in algorithms and software development. Happy to guide aspiring programmers.",
            avatar: "https://i.pravatar.cc/150?img=2",
          },
          {
            _id: "3",
            name: "Charlie Brown",
            subjectExpertise: "Literature, History",
            bio: "Enjoys exploring classic literature and historical events. Offers insights for essays and research.",
            avatar: "https://i.pravatar.cc/150?img=3",
          },
          {
            _id: "4",
            name: "Diana Prince",
            subjectExpertise: "Biology, Chemistry",
            bio: "Specializes in organic chemistry and cellular biology. Provides clear explanations for complex topics.",
            avatar: "https://i.pravatar.cc/150?img=4",
          },
        ];
        setSeniors(mockSeniors);
      } catch (err) {
        setError('Failed to fetch seniors.');
        console.error('Error fetching seniors:', err);
        setSeniors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeniors();
  }, []);

  const handleAddSenior = (e) => {
    e.preventDefault();
    if (newSenior.name && newSenior.subjectExpertise) {
      setSeniors([...seniors, { ...newSenior, _id: Date.now().toString() }]);
      setNewSenior({ name: '', subjectExpertise: '', bio: '', avatar: '' });
      setShowAddSeniorModal(false);
    }
  };

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
      <h1 className="text-white text-3xl font-bold mb-6">🧑‍🏫 Connect to Seniors</h1>

      <button
        onClick={() => setShowAddSeniorModal(true)}
        className="mb-6 px-6 py-3 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-light transition font-semibold flex items-center justify-center shadow-lg"
      >
        <FiPlus className="w-5 h-5 mr-2" />
        Add Your Senior Profile
      </button>

      {seniors.length === 0 && (
        <div className="text-center py-12">
          <FiUser className="w-16 h-16 text-dark-blue-text-light mx-auto mb-4" />
          <p className="text-dark-blue-text-light text-lg">No seniors found. Check back later!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seniors.map(senior => (
          <div key={senior._id} className="bg-dark-blue-card p-4 rounded-lg shadow-md flex flex-col items-center text-center">
            <img
              src={senior.avatar || "https://via.placeholder.com/80"}
              alt={senior.name}
              className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-accent-blue-light"
            />
            <h3 className="text-white text-xl font-bold mb-1">{senior.name}</h3>
            <p className="text-accent-blue text-sm mb-2">{senior.subjectExpertise}</p>
            <p className="text-dark-blue-text-light text-sm mb-4">{senior.bio || 'No bio available.'}</p>
            <button
              onClick={() => alert(`Connecting with ${senior.name}`)} // Placeholder for actual connection logic
              className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-light transition font-semibold flex items-center"
            >
              <FiMessageCircle className="w-4 h-4 mr-2" />
              Connect
            </button>
          </div>
        ))}
      </div>

      {showAddSeniorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-blue-card p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-white text-2xl font-bold mb-4">Add Your Senior Profile</h2>
            <form onSubmit={handleAddSenior}>
              <div className="mb-4">
                <label htmlFor="seniorName" className="block text-dark-blue-text-light text-sm font-bold mb-2">Name:</label>
                <input
                  type="text"
                  id="seniorName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-dark-blue-light text-white leading-tight focus:outline-none focus:shadow-outline"
                  value={newSenior.name}
                  onChange={(e) => setNewSenior({ ...newSenior, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="seniorSpeciality" className="block text-dark-blue-text-light text-sm font-bold mb-2">Speciality:</label>
                <input
                  type="text"
                  id="seniorSpeciality"
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-dark-blue-light text-white leading-tight focus:outline-none focus:shadow-outline"
                  value={newSenior.subjectExpertise}
                  onChange={(e) => setNewSenior({ ...newSenior, subjectExpertise: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="seniorBio" className="block text-dark-blue-text-light text-sm font-bold mb-2">Bio (Optional):</label>
                <textarea
                  id="seniorBio"
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-dark-blue-light text-white leading-tight focus:outline-none focus:shadow-outline"
                  value={newSenior.bio}
                  onChange={(e) => setNewSenior({ ...newSenior, bio: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-6">
                <label htmlFor="seniorAvatar" className="block text-dark-blue-text-light text-sm font-bold mb-2">Avatar URL (Optional):</label>
                <input
                  type="text"
                  id="seniorAvatar"
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-dark-blue-light text-white leading-tight focus:outline-none focus:shadow-outline"
                  value={newSenior.avatar}
                  onChange={(e) => setNewSenior({ ...newSenior, avatar: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-accent-blue hover:bg-accent-blue-light text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSeniorModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
