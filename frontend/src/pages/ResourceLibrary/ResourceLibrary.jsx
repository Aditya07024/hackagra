import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserFiles } from "../../utils/cloudinaryUpload";
import Loading from "../../components/Loading/Loading";
import toast from "react-hot-toast";
import Flashcard from "../../components/Flashcard/Flashcard";

export default function ResourceLibrary() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      if (authLoading || !isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching resources for user:", user.id);
        const response = await getUserFiles(user.id);

        if (response.success && Array.isArray(response.data)) {
          setResources(response.data);
          console.log("Fetched resources:", response.data);
        } else {
          setResources([]);
          toast.error("Failed to fetch resources.");
          console.error("API response for resources was not successful or data was not an array:", response);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast.error("Error fetching resources.");
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [authLoading, isAuthenticated, user]);

  if (loading) {
    return <Loading message="Loading resources..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 dark:text-gray-300">
        Please sign in to view your resource library.
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700 dark:text-gray-300 p-4">
        <h2 className="text-2xl font-bold mb-4">Your Resource Library is Empty</h2>
        <p className="text-lg">Looks like you haven't uploaded any resources yet. Head over to the Summarizer to upload your first file!</p>
        {/* Potentially add a link to the Summarizer page here */}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Your Resource Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Flashcard key={resource._id} resource={resource} />
        ))}
      </div>
    </div>
  );
}
