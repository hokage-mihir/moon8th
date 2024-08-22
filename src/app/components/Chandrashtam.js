'use client';

import React, { useState, useEffect } from 'react';

export default function Chandrashtam() {
  const [currentRashi, setCurrentRashi] = useState('');
  const [chandrashtamRashi, setChandrashtamRashi] = useState('');
  const [transitEnd, setTransitEnd] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    fetchMoonPosition();
    const interval = setInterval(fetchMoonPosition, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchMoonPosition = async () => {
    try {
      const response = await fetch('/api/moonPosition');
      const data = await response.json();
      setCurrentRashi(data.rashiName);
      setChandrashtamRashi(data.chandrashtamRashiName);
      setDebugInfo(data.debug);
      
      // Estimate transit end (approximate)
      const now = new Date();
      const transitDuration = 2.25 * 24 * 60 * 60 * 1000; // ~2.25 days in milliseconds
      const remainingDegrees = 30 - (data.longitude % 30);
      const remainingTime = (remainingDegrees / 30) * transitDuration;
      setTransitEnd(new Date(now.getTime() + remainingTime));
    } catch (error) {
      console.error('Error fetching moon position:', error);
      setDebugInfo({ error: error.message });
    }
  };

  const formatTimeRemaining = () => {
    if (!transitEnd) return '';
    const now = new Date();
    const diff = transitEnd.getTime() - now.getTime();
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Chandrashtam Calculator</h1>
      <div className="mb-6">
        <p className="text-lg text-gray-700">Current Moon Rashi: <span className="font-semibold text-blue-600">{currentRashi}</span></p>
        <p className="text-sm text-gray-600">Estimated transit ends in: {formatTimeRemaining()}</p>
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-lg text-gray-700">Chandrashtam for Rashi: <span className="font-semibold text-green-600">{chandrashtamRashi}</span></p>
      </div>
     
    </div>
  );
}