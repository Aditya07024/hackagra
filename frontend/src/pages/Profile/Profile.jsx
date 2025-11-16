import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading/Loading';
import { FiEdit, FiSave, FiX, FiUser, FiMail, FiBook, FiInfo, FiLink, FiClock, FiCalendar, FiMapPin, FiPhone, FiAward, FiGlobe, FiGithub, FiLinkedin } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    rollNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phoneNumber: '',
    tenthMarks: '',
    twelfthMarks: '',
    course: '',
    university: '',
    linkedinProfile: '',
    githubProfile: '',
    portfolioWebsite: '',
    // Senior Profile Details
    seniorDescription: '',
    profilePictureUrl: '',
    availability: '',
    connectionLink: '',
    seniorSubjects: [{ subject: '', marks: '' }],
  });
  const [editingStates, setEditingStates] = useState({
    username: false,
    rollNumber: false,
    dateOfBirth: false,
    gender: false,
    address: false,
    phoneNumber: false,
    tenthMarks: false,
    twelfthMarks: false,
    course: false,
    university: false,
    linkedinProfile: false,
    githubProfile: false,
    portfolioWebsite: false,
    seniorDescription: false,
    availability: false,
    connectionLink: false,
    seniorSubjects: false, // For the entire subject list
    profilePictureUrl: false, // For senior profile picture
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/auth/me');
        setProfileData(res.data.data);
      setFormData({
          username: res.data.data.username || '',
          email: res.data.data.email || '',
          rollNumber: res.data.data.rollNumber || '',
          dateOfBirth: res.data.data.dateOfBirth ? new Date(res.data.data.dateOfBirth).toISOString().split('T')[0] : '', // Format for input type="date"
          gender: res.data.data.gender || '',
          address: res.data.data.address || '',
          phoneNumber: res.data.data.phoneNumber || '',
          tenthMarks: res.data.data.tenthMarks || '',
          twelfthMarks: res.data.data.twelfthMarks || '',
          course: res.data.data.course || '',
          university: res.data.data.university || '',
          linkedinProfile: res.data.data.linkedinProfile || '',
          githubProfile: res.data.data.githubProfile || '',
          portfolioWebsite: res.data.data.portfolioWebsite || '',
          seniorDescription: res.data.data.seniorDescription || '',
          profilePictureUrl: res.data.data.profilePictureUrl || '',
          availability: res.data.data.availability || '',
          connectionLink: res.data.data.connectionLink || '',
          seniorSubjects: res.data.data.seniorSubjects || [{ subject: '', marks: '' }],
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubjectChange = (index, e) => {
    const newSubjects = [...formData.seniorSubjects];
    newSubjects[index][e.target.name] = e.target.value;
    setFormData({ ...formData, seniorSubjects: newSubjects });
  };

  const addSubjectField = () => {
    setFormData({ ...formData, seniorSubjects: [...formData.seniorSubjects, { subject: '', marks: '' }] });
  };

  const removeSubjectField = (index) => {
    const newSubjects = [...formData.seniorSubjects];
    newSubjects.splice(index, 1);
    setFormData({ ...formData, seniorSubjects: newSubjects });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataImg = new FormData();
    formDataImg.append('file', file);
    formDataImg.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(import.meta.env.VITE_CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formDataImg,
      });
      const data = await res.json();
      setFormData((prev) => ({ ...prev, profilePictureUrl: data.secure_url }));
      handleSaveField('profilePictureUrl', data.secure_url); // Save immediately after upload
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleEditField = (field) => {
    setEditingStates(prev => ({ ...prev, [field]: true }));
  };

  const handleSaveField = async (field, value) => {
    setEditingStates(prev => ({ ...prev, [field]: false }));
    setLoading(true);
    try {
      if (!user || !user.id) {
        toast.error('User not authenticated.');
        setLoading(false);
        return;
      }
      const userId = user.id;

      let updateData = {};
      let endpoint = `/users/${userId}/details`; // Default endpoint for general details

      if (['seniorDescription', 'availability', 'connectionLink', 'seniorSubjects', 'profilePictureUrl'].includes(field)) {
        endpoint = `/users/senior-profile`;
        if (field === 'seniorSubjects') {
            updateData = { [field]: formData.seniorSubjects };
        } else {
            updateData = { [field]: value };
        }
      } else {
        updateData = { [field]: value };
      }
      
      await api.put(endpoint, updateData);
      toast.success('Field updated successfully');
      // Re-fetch profile data to reflect changes
      const res = await api.get('/auth/me');
      setProfileData(res.data.data);
      updateUser(res.data.data); // Update auth context as well
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update field');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = (field) => {
    setEditingStates(prev => ({ ...prev, [field]: false }));
    // Reset form data to current profileData if cancel
    setFormData(prev => {
      const newFormData = { ...prev };
      switch (field) {
        case 'username':
          newFormData.username = profileData.username || '';
          break;
        case 'rollNumber':
          newFormData.rollNumber = profileData.rollNumber || '';
          break;
        case 'dateOfBirth':
          newFormData.dateOfBirth = profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : '';
          break;
        case 'gender':
          newFormData.gender = profileData.gender || '';
          break;
        case 'address':
          newFormData.address = profileData.address || '';
          break;
        case 'phoneNumber':
          newFormData.phoneNumber = profileData.phoneNumber || '';
          break;
        case 'tenthMarks':
          newFormData.tenthMarks = profileData.tenthMarks || '';
          break;
        case 'twelfthMarks':
          newFormData.twelfthMarks = profileData.twelfthMarks || '';
          break;
        case 'course':
          newFormData.course = profileData.course || '';
          break;
        case 'university':
          newFormData.university = profileData.university || '';
          break;
        case 'linkedinProfile':
          newFormData.linkedinProfile = profileData.linkedinProfile || '';
          break;
        case 'githubProfile':
          newFormData.githubProfile = profileData.githubProfile || '';
          break;
        case 'portfolioWebsite':
          newFormData.portfolioWebsite = profileData.portfolioWebsite || '';
          break;
        case 'seniorDescription':
          newFormData.seniorDescription = profileData.seniorDescription || '';
          break;
        case 'availability':
          newFormData.availability = profileData.availability || '';
          break;
        case 'connectionLink':
          newFormData.connectionLink = profileData.connectionLink || '';
          break;
        case 'profilePictureUrl':
            newFormData.profilePictureUrl = profileData.profilePictureUrl || '';
            break;
        case 'seniorSubjects':
            newFormData.seniorSubjects = profileData.seniorSubjects || [{ subject: '', marks: '' }];
            break;
        default:
          break;
      }
      return newFormData;
    });
  };

  const handleSubmitSeniorProfile = async () => {
    setLoading(true);
    try {
      if (!user || !user.id) {
        toast.error('User not authenticated.');
        setLoading(false);
        return;
      }
      const userId = user.id;

      await api.put(`/users/senior-profile`, {
        seniorDescription: formData.seniorDescription,
        profilePictureUrl: formData.profilePictureUrl,
        availability: formData.availability,
        connectionLink: formData.connectionLink,
        seniorSubjects: formData.seniorSubjects,
      });

      toast.success('Senior profile updated successfully');
      setEditingStates(prev => ({ ...prev, seniorDescription: false, availability: false, connectionLink: false, seniorSubjects: false, profilePictureUrl: false })); // Exit edit mode for senior fields
      // Re-fetch profile data to reflect changes
      const res = await api.get('/auth/me');
      setProfileData(res.data.data);
      updateUser(res.data.data); // Update auth context as well
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update senior profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSeniorProfileEdit = () => {
    setEditingStates(prev => ({ ...prev, seniorDescription: false, availability: false, connectionLink: false, seniorSubjects: false, profilePictureUrl: false }));
    // Reset form data to current profileData if cancel
    setFormData(prev => {
      const newFormData = { ...prev };
      newFormData.seniorDescription = profileData.seniorDescription || '';
      newFormData.availability = profileData.availability || '';
      newFormData.connectionLink = profileData.connectionLink || '';
      newFormData.seniorSubjects = profileData.seniorSubjects || [{ subject: '', marks: '' }];
      newFormData.profilePictureUrl = profileData.profilePictureUrl || '';
      return newFormData;
    });
  };

  if (loading || authLoading) {
    return <Loading />;
  }

  if (!profileData) {
    return <div className="text-center text-gray-500 dark:text-gray-400">No profile data available.</div>;
  }

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            {/* Removed global Edit/Save/Cancel buttons */}
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={formData.profilePictureUrl || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
                {profileData.isSeniorProfileActive && editingStates.profilePictureUrl ? (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition">
                    <FiEdit />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                ) : profileData.isSeniorProfileActive ? (
                    <button
                        onClick={() => handleEditField('profilePictureUrl')}
                        className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition"
                    >
                        <FiEdit />
                    </button>
                ) : null}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiUser /> Username
                </label>
                {editingStates.username ? (
                  <div className="flex items-center gap-2">
                  <input
                    type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveField('username', formData.username)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('username')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-900 dark:text-white">{profileData.username}</p>
                    <button
                      onClick={() => handleEditField('username')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiMail /> Email
                </label>
                <p className="text-lg text-gray-900 dark:text-white">{profileData.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiBook /> Role
                </label>
                <p className="text-lg text-gray-900 dark:text-white">{profileData.role}</p>
              </div>

              {!profileData.isSeniorProfileActive && (
                <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-700 rounded-lg text-yellow-800 dark:text-yellow-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Become a Senior!</p>
                    <p className="text-sm">Share your expertise and help others by activating your senior profile.</p>
                  </div>
                  <button
                    onClick={() => navigate('/add-senior-profile')}
                    className="ml-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-md"
                  >
                    Activate Senior Profile
                  </button>
                </div>
              )}

              {profileData.isSeniorProfileActive && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <FaStar /> Average Rating
                  </label>
                  <p className="text-lg text-yellow-500 dark:text-yellow-400">
                    {profileData.averageRating ? profileData.averageRating.toFixed(1) : 'No ratings yet'}
                  </p>
                </div>
              )}

              {/* Personal Details */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Personal Details</h2>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiInfo /> Roll Number
                </label>
                {editingStates.rollNumber ? (
                  <div className="flex items-center gap-2">
                  <input
                    type="text"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveField('rollNumber', formData.rollNumber)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('rollNumber')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-900 dark:text-white">{profileData.rollNumber || 'Not set'}</p>
                    <button
                      onClick={() => handleEditField('rollNumber')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiCalendar /> Date of Birth
                </label>
                {editingStates.dateOfBirth ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveField('dateOfBirth', formData.dateOfBirth)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('dateOfBirth')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-900 dark:text-white">{profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'Not set'}</p>
                    <button
                      onClick={() => handleEditField('dateOfBirth')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiUser /> Gender
                </label>
                {editingStates.gender ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <button
                      onClick={() => handleSaveField('gender', formData.gender)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('gender')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-900 dark:text-white">{profileData.gender || 'Not set'}</p>
                    <button
                      onClick={() => handleEditField('gender')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiMapPin /> Address
                </label>
                {editingStates.address ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveField('address', formData.address)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('address')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-900 dark:text-white">{profileData.address || 'Not set'}</p>
                    <button
                      onClick={() => handleEditField('address')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiPhone /> Phone Number
                </label>
                {editingStates.phoneNumber ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveField('phoneNumber', formData.phoneNumber)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('phoneNumber')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-900 dark:text-white">{profileData.phoneNumber || 'Not set'}</p>
                    <button
                      onClick={() => handleEditField('phoneNumber')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              {/* Educational Details */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Educational Details</h2>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiAward /> 10th Marks
                </label>
                {editingStates.tenthMarks ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.tenthMarks}
                      onChange={(e) => setFormData({ ...formData, tenthMarks: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveField('tenthMarks', formData.tenthMarks)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('tenthMarks')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-900 dark:text-white">{profileData.tenthMarks || 'Not set'}</p>
                    <button
                      onClick={() => handleEditField('tenthMarks')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiAward /> 12th Marks
                </label>
                {editingStates.twelfthMarks ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.twelfthMarks}
                      onChange={(e) => setFormData({ ...formData, twelfthMarks: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveField('twelfthMarks', formData.twelfthMarks)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('twelfthMarks')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-900 dark:text-white">{profileData.twelfthMarks || 'Not set'}</p>
                    <button
                      onClick={() => handleEditField('twelfthMarks')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiBook /> Course
                </label>
                {editingStates.course ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveField('course', formData.course)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('course')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-900 dark:text-white">{profileData.course || 'Not set'}</p>
                    <button
                      onClick={() => handleEditField('course')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiBook /> University
                </label>
                {editingStates.university ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveField('university', formData.university)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('university')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-900 dark:text-white">{profileData.university || 'Not set'}</p>
                    <button
                      onClick={() => handleEditField('university')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Social Media & Portfolio</h2>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiLinkedin /> LinkedIn Profile
                </label>
                {editingStates.linkedinProfile ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.linkedinProfile}
                      onChange={(e) => setFormData({ ...formData, linkedinProfile: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveField('linkedinProfile', formData.linkedinProfile)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('linkedinProfile')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-blue-600 dark:text-blue-400"><a href={profileData.linkedinProfile} target="_blank" rel="noopener noreferrer">{profileData.linkedinProfile || 'Not set'}</a></p>
                    <button
                      onClick={() => handleEditField('linkedinProfile')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiGithub /> GitHub Profile
                </label>
                {editingStates.githubProfile ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.githubProfile}
                      onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveField('githubProfile', formData.githubProfile)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('githubProfile')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-blue-600 dark:text-blue-400"><a href={profileData.githubProfile} target="_blank" rel="noopener noreferrer">{profileData.githubProfile || 'Not set'}</a></p>
                    <button
                      onClick={() => handleEditField('githubProfile')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FiGlobe /> Portfolio Website
                </label>
                {editingStates.portfolioWebsite ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.portfolioWebsite}
                      onChange={(e) => setFormData({ ...formData, portfolioWebsite: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveField('portfolioWebsite', formData.portfolioWebsite)}
                      disabled={loading}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('portfolioWebsite')}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-blue-600 dark:text-blue-400"><a href={profileData.portfolioWebsite} target="_blank" rel="noopener noreferrer">{profileData.portfolioWebsite || 'Not set'}</a></p>
                    <button
                      onClick={() => handleEditField('portfolioWebsite')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              {profileData.isSeniorProfileActive && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Senior Profile Details</h2>
                  <div className="flex justify-end items-center mb-4">
                    {!editingStates.seniorDescription && !editingStates.availability && !editingStates.connectionLink && !editingStates.seniorSubjects && !editingStates.profilePictureUrl ? (
                      <button
                        onClick={() => setEditingStates(prev => ({ ...prev, seniorDescription: true, availability: true, connectionLink: true, seniorSubjects: true, profilePictureUrl: true }))}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <FiEdit /> Edit Senior Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSubmitSeniorProfile}
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                          <FiSave /> Save Senior Profile
                        </button>
                        <button
                          onClick={handleCancelSeniorProfileEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                          <FiX /> Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <FiInfo /> Senior Description
                    </label>
                    {editingStates.seniorDescription ? (
                      <textarea
                        value={formData.seniorDescription}
                        onChange={(e) => setFormData({ ...formData, seniorDescription: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows="4"
                      ></textarea>
                    ) : (
                      <p className="text-lg text-gray-900 dark:text-white">{profileData.seniorDescription || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <FiClock /> Availability
                    </label>
                    {editingStates.availability ? (
                      <input
                        type="text"
                        value={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-lg text-gray-900 dark:text-white">{profileData.availability || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <FiLink /> Connection Link
                    </label>
                    {editingStates.connectionLink ? (
                      <input
                        type="text"
                        value={formData.connectionLink}
                        onChange={(e) => setFormData({ ...formData, connectionLink: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-lg text-blue-600 dark:text-blue-400"><a href={profileData.connectionLink} target="_blank" rel="noopener noreferrer">{profileData.connectionLink || 'Not set'}</a></p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <FiBook /> Subject Specialties & Marks
                    </label>
                    {editingStates.seniorSubjects ? (
                      <div className="space-y-2">
                        {formData.seniorSubjects.map((subjectData, index) => (
                          <div key={index} className="flex space-x-2">
                            <input
                              type="text"
                              name="subject"
                              value={subjectData.subject}
                              onChange={(e) => handleSubjectChange(index, e)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Subject"
                            />
                            <input
                              type="text"
                              name="marks"
                              value={subjectData.marks}
                              onChange={(e) => handleSubjectChange(index, e)}
                              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Marks"
                            />
                            <button
                              type="button"
                              onClick={() => removeSubjectField(index)}
                              className="p-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addSubjectField}
                          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium mt-2"
                        >
                          <FaPlus className="mr-1" /> Add Subject
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {profileData.seniorSubjects && profileData.seniorSubjects.length > 0 ? (
                          profileData.seniorSubjects.map((subjectData, index) => (
                            <p key={index} className="text-lg text-gray-900 dark:text-white">
                              {subjectData.subject}: {subjectData.marks}
                            </p>
                          ))
                        ) : (
                          <p className="text-lg text-gray-500 dark:text-gray-400">No specialties set</p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Reviews Section */}
              {profileData.isSeniorProfileActive && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reviews Received</h2>
                  {profileData.reviews && profileData.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {profileData.reviews.map((review) => (
                        <div key={review._id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center mb-2">
                            <img
                              src={review.reviewer.profilePictureUrl || 'https://via.placeholder.com/40'}
                              alt={review.reviewer.username}
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{review.reviewer.username}</p>
                              <div className="flex items-center text-yellow-500 text-sm">
                                {[...Array(5)].map((star, i) => (
                                  <FaStar key={i} className={i < review.rating ? "" : "text-gray-300 dark:text-gray-600"} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 mb-2">{review.comment}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-lg text-gray-500 dark:text-gray-400">No reviews received yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

