import { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  FiPlus,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiAward,
  FiStar,
  FiFileText,
  FiBookOpen,
  FiCheckCircle,
  FiTrendingUp,
  FiClock,
  FiZap,
  FiDollarSign,
  FiMessageCircle, // Added for notifications card chat bubble
  FiUpload, // For upload files card
  FiList, // For to-do list card
  FiX, // For delete button in to-do list
  FiUsers, // Added for Connect to Seniors card
} from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { showDashboardNotifications, toggleDashboardNotifications } = useTheme();
  const [stats, setStats] = useState({
    filesUploaded: 0,
    summariesCreated: 0,
    quizzesTaken: 0,
  });
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [plans, setPlans] = useState([]);
  const [greeting, setGreeting] = useState("");
  // State for To-Do List
  const [todos, setTodos] = useState([
    { id: 1, text: "Complete React project", completed: false, dueDate: "Today" },
    { id: 2, text: "Study for Algorithms exam", completed: false, dueDate: "Tomorrow" },

  ]);
  const [newTodoText, setNewTodoText] = useState('');

  // Function to add a new todo
  const addTodo = () => {
    if (newTodoText.trim() === '') return;
    setTodos([...todos, { id: Date.now(), text: newTodoText, completed: false, dueDate: "Today" }]);
    setNewTodoText('');
  };

  // Function to toggle todo completion
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Function to delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Mock file upload state (for demonstration)
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      // Here you would typically send the file to your backend
      alert(`File "${selectedFile.name}" uploaded successfully! (mock)`);
      setSelectedFile(null);
    } else {
      alert('Please select a file to upload.');
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats({
          filesUploaded: 0,
          summariesCreated: 0,
          quizzesTaken: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/leaderboard");
        setLeaderboard(res.data.slice(0, 5)); // Get top 5
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        setLeaderboard([]);
      }
    };

    const fetchPlans = async () => {
      try {
        const res = await api.get("/planner");
        setPlans(res.data.slice(0, 1)); // Get latest plan
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        setPlans([]);
      }
    };

    fetchData();
    fetchLeaderboard();
    fetchPlans();
  }, []);

  // Calculate percentages based on original stats
  const total =
    (stats.filesUploaded || 0) +
    (stats.summariesCreated || 0) +
    (stats.quizzesTaken || 0);
  const safeTotal = total > 0 ? total : 1;
  const filesUploadedPercent =
    Math.round(((stats.filesUploaded || 0) / safeTotal) * 100) || 0;
  const summariesCreatedPercent =
    Math.round(((stats.summariesCreated || 0) / safeTotal) * 100) || 0;
  const quizzesTakenPercent =
    Math.round(((stats.quizzesTaken || 0) / safeTotal) * 100) || 0;

  // Adapt activity data to match the new UI's chart data format
  const activityDataAdapted = [
    { name: "Mon", value: stats.filesUploaded || 0 },
    { name: "Tue", value: (stats.filesUploaded || 0) + (stats.summariesCreated || 0) * 0.5 },
    { name: "Wed", value: (stats.summariesCreated || 0) + (stats.quizzesTaken || 0) * 0.5 },
    { name: "Thu", value: stats.quizzesTaken || 0 },
    { name: "Fri", value: (stats.filesUploaded || 0) * 0.75 },
    { name: "Sat", value: (stats.summariesCreated || 0) * 1.2 },
    { name: "Sun", value: (stats.quizzesTaken || 0) * 0.9 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-blue-bg flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-dark-blue-bg">
      <h1 className="text-white text-3xl font-bold mb-6">{greeting}! 👋</h1>
      <p className="text-dark-blue-text-light text-lg mb-8">Welcome back! Here's a quick overview of your academic journey and tools to help you succeed.</p>

      {/* New Buttons for Upload and Take Quiz */}
      <div className="flex justify-end space-x-4 mb-6">
        <label
          htmlFor="file-upload-top-button"
          className="px-6 py-3 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-light transition cursor-pointer font-semibold flex items-center shadow-lg"
        >
          <FiUpload className="w-5 h-5 mr-2" />
          Upload File
        </label>
        <input
          type="file"
          className="hidden"
          id="file-upload-top-button"
          onChange={handleFileChange}
        />
        <button
          onClick={() => navigate("/quiz")}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center shadow-lg"
        >
          <FiFileText className="w-5 h-5 mr-2" />
          Take Quiz
        </button>
      </div>

      {/* Activity Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Files Uploaded Card */}
        <div className="bg-dark-blue-card p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-dark-blue-text text-sm">Files Uploaded</p>
            <h3 className="text-white text-2xl font-bold mt-1">
              {stats.filesUploaded.toLocaleString()}
              <span
                className={`ml-2 text-sm font-bold ${
                  filesUploadedPercent >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                +{filesUploadedPercent}%
              </span>
            </h3>
            <p className="text-dark-blue-text-light text-xs mt-1">
              This month's file uploads compared to last month.
            </p>
          </div>
          <div className="p-3 bg-accent-blue-light rounded-full text-white">
            <FiFileText className="w-6 h-6" />
          </div>
        </div>

        {/* Summaries Created Card */}
        <div className="bg-dark-blue-card p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-dark-blue-text text-sm">Summaries Created</p>
            <h3 className="text-white text-2xl font-bold mt-1">
              {stats.summariesCreated.toLocaleString()}
              <span
                className={`ml-2 text-sm font-bold ${
                  summariesCreatedPercent >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                +{summariesCreatedPercent}%
              </span>
            </h3>
            <p className="text-dark-blue-text-light text-xs mt-1">
              This month's summaries compared to last month.
            </p>
          </div>
          <div className="p-3 bg-red-500/20 rounded-full text-white">
            <FiBookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Quizzes Taken Card */}
        <div className="bg-dark-blue-card p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-dark-blue-text text-sm">Quizzes Taken</p>
            <h3 className="text-white text-2xl font-bold mt-1">
              {stats.quizzesTaken.toLocaleString()}
              <span
                className={`ml-2 text-sm font-bold ${
                  quizzesTakenPercent >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                +{quizzesTakenPercent}%
              </span>
            </h3>
            <p className="text-dark-blue-text-light text-xs mt-1">
              This month's quizzes compared to last month.
            </p>
          </div>
          <div className="p-3 bg-green-500/20 rounded-full text-white">
            <FiCheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* New row for Upload Files and To-Do List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 mb-2">
        {/* To-Do List Card */}
        <div className="bg-dark-blue-card p-2 rounded-1xl shadow-md">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-2xl font-bold text-white">Your Planner</h2>
          </div>
          <p className="text-dark-blue-text-light text-sm px-2 mb-4">Organize your tasks and stay on top of your studies!</p>
          <div className="flex mb-4 px-2 py-2 bg-dark-blue-light rounded-lg items-center">
            <FiPlus className="w-5 h-5 text-accent-blue mr-3" />
            <input
              type="text"
              placeholder="Add a to-do"
              className="flex-grow bg-transparent text-white focus:outline-none placeholder-dark-blue-text-light text-lg"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addTodo();
                }
              }}
            />
          </div>
          <div className="space-y-3">
            {todos.length > 0 ? (
              todos.map((todo) => (
                <div key={todo.id} className="flex items-center bg-dark-blue-bg p-3 rounded-lg shadow-sm text-white group relative pr-16">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="form-checkbox h-5 w-5 text-accent-blue rounded-md border-dark-blue-text-light bg-dark-blue-light focus:ring-accent-blue cursor-pointer"
                  />
                  <span
                    className={`ml-3 text-lg flex-grow ${todo.completed ? 'line-through text-dark-blue-text-light' : 'text-white'}`}
                  >
                    {todo.text}
                  </span>
                  <span className="text-dark-blue-text-light text-sm absolute right-4 top-1/2 -translate-y-1/2 group-hover:hidden">
                    {todo.dueDate}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="ml-4 text-red-400 hover:text-red-500 transition-colors duration-200 absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:block"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-dark-blue-text-light text-center py-4">No tasks yet! Add a new one above.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Leaderboard Card */}
        <div className="lg:col-span-1 bg-dark-blue-card p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">🏆 Leaderboard</h2>
            <button
              onClick={() => navigate("/leaderboard")}
              className="text-accent-blue text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          {leaderboard.length > 0 ? (
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-dark-blue-text text-lg font-bold">
                      #{index + 1}
                    </span>
                    <img
                      src={user.avatar || "https://via.placeholder.com/40"}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <p className="text-white text-lg font-medium">{user.username}</p>
                  </div>
                  <p className="text-accent-blue text-lg font-bold">
                    {user.totalScore} pts
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiAward className="w-16 h-16 text-dark-blue-text-light mx-auto mb-4" />
              <p className="text-dark-blue-text-light">
                No leaderboard data yet.
                <br />
                Be the first to take a quiz!
              </p>
              <p className="text-dark-blue-text-light text-sm">Compete with your peers and see who's at the top!</p>
            </div>
          )}
        </div>

        {/* Revision Planner Card */}
        <div className="bg-dark-blue-card p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">🗓️ Revision Planner</h2>
            <button
              onClick={() => navigate("/planner")}
              className="text-accent-blue text-sm font-medium hover:underline"
            >
              Manage Plans
            </button>
          </div>
          {plans.length > 0 ? (
            <div className="space-y-4">
              {plans.map((plan) => (
                <div key={plan._id} className="bg-dark-blue-light p-4 rounded-lg">
                  <h3 className="text-white font-bold text-lg mb-1">{plan.title}</h3>
                  <p className="text-dark-blue-text-light text-sm mb-2">
                    {new Date(plan.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-dark-blue-text text-sm">{plan.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiCalendar className="w-16 h-16 text-dark-blue-text-light mx-auto mb-4" />
              <p className="text-dark-blue-text-light mb-4">
                No study plans yet.
                <br />
                Create a study plan to stay organized
              </p>
              <p className="text-dark-blue-text-light text-sm mb-4">Plan your revisions and achieve your academic goals effectively.</p>
              <button
                onClick={() => navigate("/planner")}
                className="px-6 py-3 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-light transition font-semibold"
              >
                Create Plan
              </button>
            </div>
          )}
        </div>

        {/* Resource Library Card */}
        <div className="bg-dark-blue-card p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">📚 Resource Library</h2>
            <button
              onClick={() => navigate("/resources")}
              className="text-accent-blue text-sm font-medium hover:underline"
            >
              View Resources
            </button>
          </div>
          <div className="text-center py-12">
            <FiBookOpen className="w-16 h-16 text-dark-blue-text-light mx-auto mb-4" />
            <p className="text-dark-blue-text-light mb-4">
              Access a collection of study materials.
              <br />
              Explore and learn!
            </p>
            <p className="text-dark-blue-text-light text-sm mb-4">Find and organize all your essential study resources in one place.</p>
            <button
              onClick={() => navigate("/resources")}
              className="px-6 py-3 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-light transition font-semibold"
            >
              Browse Resources
            </button>
          </div>
        </div>

        {/* Connect to Seniors Card */}
        <div
          onClick={() => navigate("/connect-to-seniors")}
          className="bg-dark-blue-card p-6 rounded-2xl shadow-lg cursor-pointer hover:bg-dark-blue-light transition-colors duration-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">🧑‍🏫 Connect to Seniors</h2>
            
          </div>
          <div className="text-center py-12">
            <FiUsers className="w-16 h-16 text-dark-blue-text-light mx-auto mb-4" />
            <p className="text-dark-blue-text-light mb-4">
              Get guidance from experienced seniors in your field.
              <br />
              Connect and learn!
            </p>
            
          </div>
        </div>
      </div>

      {/* Weekly Activity Progress Graph */}
      <div className="bg-dark-blue-card p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Weekly Activity</h2>
        <p className="text-dark-blue-text text-sm mb-4">Your activity over the past week</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityDataAdapted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <XAxis dataKey="name" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1B254B",
                  border: "none",
                  borderRadius: "8px",
                  color: "#A0AEC0",
                }}
                itemStyle={{ color: "#A0AEC0" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#FF4081" // Accent color for the line (same as dark theme image)
                strokeWidth={3}
                dot={{ r: 0 }}
                activeDot={{ r: 5, fill: "#FF4081" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
