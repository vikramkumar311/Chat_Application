import React, { useState } from 'react';

const AdminPanel = ({ socket }) => {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [status, setStatus] = useState('');

  const sendBroadcast = (e) => {
    e.preventDefault();
    
    if (!broadcastMessage.trim()) {
      setStatus('Please enter a message');
      return;
    }

    if (!adminKey.trim()) {
      setStatus('Please enter admin key');
      return;
    }

    socket.emit('adminBroadcast', { 
      message: broadcastMessage, 
      adminKey: adminKey 
    });

    setBroadcastMessage('');
    setStatus('Broadcast sent!');
    
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div style={{ 
      padding: '1rem', 
      background: '#f8f9fa', 
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <h4 style={{ 
        color: '#333', 
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        🔐 Admin Panel
      </h4>
      
      <form onSubmit={sendBroadcast}>
        <input
          type="password"
          className="admin-input"
          placeholder="Admin key (hint: admin123)"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          style={{ marginBottom: '0.5rem' }}
        />
        
        <textarea
          className="admin-input"
          placeholder="Enter broadcast message..."
          value={broadcastMessage}
          onChange={(e) => setBroadcastMessage(e.target.value)}
          rows="3"
          style={{ 
            resize: 'vertical',
            marginBottom: '0.5rem'
          }}
        />
        
        <button 
          type="submit" 
          className="admin-button"
          style={{ 
            width: '100%',
            background: '#28a745'
          }}
        >
          📢 Send Broadcast to All Rooms
        </button>
      </form>
      
      {status && (
        <div style={{ 
          marginTop: '0.5rem',
          padding: '0.5rem',
          borderRadius: '4px',
          fontSize: '0.85rem',
          background: status.includes('sent') ? '#d4edda' : '#f8d7da',
          color: status.includes('sent') ? '#155724' : '#721c24',
          border: `1px solid ${status.includes('sent') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {status}
        </div>
      )}
      
      <div style={{ 
        marginTop: '1rem',
        fontSize: '0.75rem',
        color: '#666',
        fontStyle: 'italic'
      }}>
        Admin broadcasts will be sent to all users in all rooms.
      </div>
    </div>
  );
};

export default AdminPanel;
