import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Guidelines = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [message, setMessage] = useState('');

  const navigateToRegister = () => {
    // Navigate to the register page
    navigate('/register'); // Specify the path to the register page
  };

  const startMonitoring = async () => {
    setMessage('Monitoring started');
    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      setMessage(data); // Set the message received from the server
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to start monitoring'); // Display a message for error
    }
  };

  const handleDownload = () => {
    window.location.href = 'http://127.0.0.1:8000/get_attendance_logs';
  };

  return (
    <div className="container mx-auto h-screen flex justify-center items-center relative" style={{ backgroundImage: "url('smart_attendance_bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Overlay to make the background image lighter */}
      <div className="absolute inset-0 bg-gray-500 opacity-50"></div>
      
      <div className="max-w-lg z-10">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center space-x-4">
            {/* Button to register a new user */}
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={navigateToRegister}>
              Register new user
            </button>
            {/* Button to start monitoring */}
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={startMonitoring}>
              Start Monitoring
            </button>
            {/* Button to get attendance */}
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleDownload}>
              Get Attendance
            </button>
          </div>
          {message && <p className="text-center mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
