import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters long');
      return;
    }

    if (!room.trim()) {
      setError('Room number is required');
      return;
    }

    setError('');
    
    // Navigate to chat with query parameters
    navigate(`/chat?username=${encodeURIComponent(username.trim())}&room=${encodeURIComponent(room.trim())}`);
  };

  return (
    <div className="join-container">
      <h1>💬 Chat App</h1>
      <form onSubmit={handleSubmit} className="join-form">
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="room">Room Number</label>
          <input
            type="text"
            id="room"
            placeholder="Enter room number..."
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            maxLength={20}
          />
        </div>
        
        <button 
          type="submit" 
          className="join-button"
          disabled={!username.trim() || !room.trim()}
        >
          Join Chat Room
        </button>
        
        {error && <div className="error-message">{error}</div>}
      </form>
      
      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        <p><strong>Tips:</strong></p>
        <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
          <li>Choose any room number to join (e.g., 1, 2, abc)</li>
          <li>Users in the same room can chat together</li>
          <li>Admin can broadcast to all rooms</li>
        </ul>
      </div>
    </div>
  );
};

export default Join;
