import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Message from './Message';
import UsersList from './UsersList';
import AdminPanel from './AdminPanel';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const [typing, setTyping] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const usernameParam = queryParams.get('username');
    const roomParam = queryParams.get('room');

    if (!usernameParam || !roomParam) {
      navigate('/');
      return;
    }

    setUsername(usernameParam);
    setRoom(roomParam);

    // Initialize socket connection
    const socketInstance = io('http://localhost:5000');
    setSocket(socketInstance);

    // Join room
    socketInstance.emit('join', { username: usernameParam, room: roomParam }, (error) => {
      if (error) {
        alert(error);
        navigate('/');
      }
    });

    // Listen for messages
    socketInstance.on('message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Listen for previous messages
    socketInstance.on('previousMessages', (previousMessages) => {
      setMessages(previousMessages);
    });

    // Listen for room data
    socketInstance.on('roomData', ({ users }) => {
      setUsers(users);
    });

    // Listen for typing indicator
    socketInstance.on('typing', (data) => {
      setTyping(data.username);
      setTimeout(() => setTyping(''), 3000);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [location.search, navigate]);

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (message.trim() && socket) {
      // Check for private message format: @username message
      if (message.startsWith('@')) {
        const parts = message.split(' ');
        const targetUsername = parts[0].substring(1);
        const privateMessage = parts.slice(1).join(' ');
        
        if (targetUsername && privateMessage) {
          socket.emit('privateMessage', { 
            targetUsername, 
            message: privateMessage 
          });
        }
      } else {
        socket.emit('sendMessage', message, () => {
          setMessage('');
        });
      }
      setMessage('');
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { username, room });
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.disconnect();
    }
    navigate('/');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!socket) {
    return (
      <div className="chat-container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          fontSize: '1.2rem'
        }}>
          Connecting to chat...
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2>💬 Chat Room</h2>
          <div className="room-info">
            <div>Room: {room}</div>
            <div>User: {username}</div>
          </div>
        </div>
        
        <UsersList users={users} currentUsername={username} />
        
        <div className="admin-panel">
          <button 
            className="admin-button"
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            style={{ marginBottom: '0.5rem' }}
          >
            {showAdminPanel ? 'Hide Admin' : 'Show Admin Panel'}
          </button>
          
          {showAdminPanel && <AdminPanel socket={socket} />}
          
          <button className="leave-button" onClick={leaveRoom}>
            Leave Room
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <Message 
              key={msg.id || index}
              message={msg}
              isOwn={msg.username === username}
              formatTime={formatTime}
            />
          ))}
          {typing && (
            <div className="typing-indicator">
              {typing} is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="message-input-container">
          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              className="message-input"
              placeholder="Type a message... (Use @username for private messages)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleTyping}
              maxLength={500}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!message.trim()}
            >
              ➤
            </button>
          </form>
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#666', 
            marginTop: '0.5rem',
            textAlign: 'center'
          }}>
            Tips: Use @username to send private messages
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
