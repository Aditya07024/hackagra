import React from 'react';

export default function Flashcard({ resource }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">{resource.fileName}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Uploaded on: {new Date(resource.uploadDate).toLocaleDateString()}</p>
        {resource.fileType && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Type: {resource.fileType}</p>
        )}
      </div>
      {resource.fileUrl && (
        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2 mt-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 dark:bg-gradient-to-r dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 dark:text-white"
        >
          View Resource
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
      )}
    </div>
  );
}
