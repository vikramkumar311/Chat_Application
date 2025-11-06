import React from 'react';

const UsersList = ({ users, currentUsername }) => {
  const getInitials = (username) => {
    return username.charAt(0).toUpperCase();
  };

  const getRandomColor = (username) => {
    const colors = [
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #4facfe, #00f2fe)',
      'linear-gradient(135deg, #43e97b, #38f9d7)',
      'linear-gradient(135deg, #fa709a, #fee140)',
      'linear-gradient(135deg, #a8edea, #fed6e3)',
      'linear-gradient(135deg, #d299c2, #fef9d7)',
      'linear-gradient(135deg, #89f7fe, #66a6ff)'
    ];
    
    const hash = username.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="users-list">
      <h3>
        <span>👥</span>
        Online Users ({users.length})
      </h3>
      {users.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#666', 
          fontStyle: 'italic',
          padding: '1rem'
        }}>
          No users online
        </div>
      ) : (
        users.map((user) => (
          <div key={user.socketId} className="user-item">
            <div 
              className="user-avatar"
              style={{ background: getRandomColor(user.username) }}
            >
              {getInitials(user.username)}
            </div>
            <div>
              <div style={{ fontWeight: 'bold' }}>
                {user.username}
                {user.username === currentUsername && (
                  <span style={{ 
                    fontSize: '0.8rem', 
                    color: '#667eea',
                    marginLeft: '0.5rem'
                  }}>
                    (You)
                  </span>
                )}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#666',
                marginTop: '0.25rem'
              }}>
                {user.joinTime ? 
                  `Joined ${new Date(user.joinTime).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}` : 
                  'Online'
                }
              </div>
            </div>
          </div>
        ))
      )}
      
      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        background: '#e8f4f8',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: '#0c5460'
      }}>
        💡 <strong>Pro tip:</strong> Use @username in your message to send private messages to specific users!
      </div>
    </div>
  );
};

export default UsersList;
