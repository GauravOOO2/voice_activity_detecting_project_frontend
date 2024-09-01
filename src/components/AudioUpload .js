import React, { useState } from 'react';
import axios from 'axios';

const AudioUpload = () => {
    const [file, setFile] = useState(null);
    const [vadResults, setVadResults] = useState([]);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(''); // Reset error on new file selection
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select an audio file first.');
            return;
        }

        const formData = new FormData();
        formData.append('audio', file);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setVadResults(response.data.vadResults);
        } catch (error) {
            setError('Error uploading file. Please try again.');
            console.error('Error uploading file:', error);
        }
    };

    const renderVadResults = () => {
        return vadResults.map((result, index) => {
            const [start, end] = result;
            const gapNumber = index + 1;
            return (
                <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4 shadow-md">
                    <h4 className="font-semibold text-blue-600">Gap {gapNumber}:</h4>
                    <p className="text-sm text-gray-700">Start: <span className="font-medium">{start} seconds</span></p>
                    <p className="text-sm text-gray-700">End: <span className="font-medium">{end} seconds</span></p>
                    <p className="text-sm text-gray-700">Duration: <span className="font-medium">{(end - start).toFixed(2)} seconds</span></p>
                </div>
            );
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Voice Activity Detection</h1>
                
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="audio/*" 
                    className="w-full px-4 py-2 mb-4 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    onClick={handleUpload} 
                    className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Upload
                </button>

                {error && (
                    <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
                )}

                {vadResults.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Silence Detected:</h3>
                        {renderVadResults()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioUpload;
