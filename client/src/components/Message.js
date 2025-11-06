import React from 'react';

const Message = ({ message, isOwn, formatTime }) => {
  const getMessageClass = () => {
    if (message.isAdmin || message.username === 'Admin') {
      if (message.type === 'welcome' || message.type === 'join' || message.type === 'leave') {
        return 'message message-system';
      }
      return 'message message-admin';
    }
    return isOwn ? 'message message-own' : 'message message-other';
  };

  const getMessageIcon = () => {
    if (message.type === 'join') return '👋';
    if (message.type === 'leave') return '👋';
    if (message.type === 'broadcast') return '📢';
    if (message.type === 'private') return '🔒';
    if (message.type === 'welcome') return '🎉';
    return '';
  };

  return (
    <div className={getMessageClass()}>
      {!message.isAdmin && message.username !== 'Admin' && (
        <div className="message-header">
          <span className="message-username">
            {isOwn ? 'You' : message.username}
          </span>
          <span className="message-time">
            {formatTime(message.timestamp)}
          </span>
        </div>
      )}
      
      <div className="message-content">
        {getMessageIcon() && (
          <span style={{ marginRight: '0.5rem' }}>
            {getMessageIcon()}
          </span>
        )}
        {message.message}
      </div>
      
      {(message.isAdmin || message.username === 'Admin') && (
        <div className="message-time" style={{ 
          textAlign: 'center', 
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          opacity: 0.7
        }}>
          {formatTime(message.timestamp)}
        </div>
      )}
    </div>
  );
};

export default Message;
