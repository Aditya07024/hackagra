import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading/Loading';
import { FiPlay, FiClock, FiAward, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && currentQuiz) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentQuiz && !score) {
      handleSubmitQuiz();
    }
  }, [timeLeft, currentQuiz]);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quiz');
      setQuizzes(res.data);
    } catch (error) {
      toast.error('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (quizId) => {
    setQuizLoading(true);
    try {
      const res = await api.post(`/quiz/${quizId}/start`);
      setCurrentQuiz(res.data);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setAnswers([]);
      setTimeLeft(res.data.duration * 60);
      setScore(null);
    } catch (error) {
      toast.error('Failed to start quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleSubmitQuiz(newAnswers);
    }
  };

  const handleSubmitQuiz = async (finalAnswers = null) => {
    const answersToSubmit = finalAnswers || answers;
    try {
      const res = await api.post(`/quiz/${currentQuiz._id}/submit`, {
        answers: answersToSubmit,
      });
      setScore(res.data);
      setCurrentQuiz(null);
      fetchQuizzes();
    } catch (error) {
      toast.error('Failed to submit quiz');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <Loading />;

  if (score) {
    return (
      <div className="min-h-screen bg-dark-blue-bg py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-dark-blue-card rounded-lg shadow-md p-8 text-center">
            <FiAward className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-dark-blue-text-light">Your Score</p>
                <p className="text-4xl font-bold text-accent-blue">
                  {score.score}/{score.total}
                </p>
              </div>
              <div>
                <p className="text-dark-blue-text-light">Accuracy</p>
                <p className="text-2xl font-semibold text-green-500">
                  {score.accuracy}%
                </p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setScore(null);
                  setCurrentQuiz(null);
                }}
                className="px-6 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-light transition"
              >
                Take Another Quiz
              </button>
              <Link
                to="/leaderboard"
                className="px-6 py-2 bg-dark-blue-light text-white rounded-lg hover:bg-dark-blue-text-light transition"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentQuiz) {
    const question = currentQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;

    return (
      <div className="min-h-screen bg-dark-blue-bg py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-dark-blue-card rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">{currentQuiz.title}</h2>
              <div className="flex items-center gap-2 text-red-500">
                <FiClock />
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="w-full bg-dark-blue-light rounded-full h-2">
              <div
                className="bg-accent-blue h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-dark-blue-text-light mt-2">
              Question {currentQuestion + 1} of {currentQuiz.questions.length}
            </p>
          </div>

          <div className="bg-dark-blue-card rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              {question.question}
            </h3>
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selectedAnswer === idx
                      ? 'border-accent-blue bg-accent-blue/20'
                      : 'border-dark-blue-light hover:border-accent-blue/50'
                  }`}
                >
                  <span className="font-semibold text-white">{option}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="mt-6 w-full px-6 py-3 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-light transition font-semibold"
            >
              {currentQuestion < currentQuiz.questions.length - 1 ? 'Next' : 'Submit Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Quiz</h1>
          <Link
            to="/leaderboard"
            className="flex items-center gap-2 px-4 py-2 bg-dark-blue-light text-white rounded-lg hover:bg-dark-blue-text-light transition"
          >
            <FiAward /> Leaderboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-dark-blue-card rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
              <p className="text-dark-blue-text-light text-sm mb-4">{quiz.description}</p>
              <div className="flex items-center gap-4 text-sm text-dark-blue-text-light mb-4">
                <span className="flex items-center gap-1">
                  <FiClock /> {quiz.duration} min
                </span>
                <span>{quiz.questions.length} questions</span>
              </div>
              <button
                onClick={() => startQuiz(quiz._id)}
                disabled={quizLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-light transition disabled:opacity-50"
              >
                <FiPlay /> Start Quiz
              </button>
            </div>
          ))}
          {quizzes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-dark-blue-text-light">No quizzes available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

