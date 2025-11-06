const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let users = []; // { username, room, socketId, joinTime }
let messages = []; // { id, username, room, message, timestamp, isAdmin, type }

// Utility functions
const addUser = ({ socketId, username, room }) => {
  const existingUser = users.find(user => user.username.toLowerCase() === username.toLowerCase() && user.room === room);
  
  if (existingUser) {
    return { error: 'Username is taken in this room' };
  }

  const user = { socketId, username, room, joinTime: new Date() };
  users.push(user);
  return { user };
};

const removeUser = (socketId) => {
  const index = users.findIndex(user => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (socketId) => {
  return users.find(user => user.socketId === socketId);
};

const getUsersInRoom = (room) => {
  return users.filter(user => user.room === room);
};

const addMessage = ({ username, room, message, isAdmin = false, type = 'message' }) => {
  const messageObj = {
    id: Date.now() + Math.random(),
    username,
    room,
    message,
    timestamp: new Date(),
    isAdmin,
    type
  };
  messages.push(messageObj);
  return messageObj;
};

const getMessagesInRoom = (room) => {
  return messages.filter(message => message.room === room);
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join room
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ socketId: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    // Send welcome message to user
    socket.emit('message', {
      id: Date.now(),
      username: 'Admin',
      message: `Welcome to room ${user.room}, ${user.username}!`,
      timestamp: new Date(),
      isAdmin: true,
      type: 'welcome'
    });

    // Notify others in room
    const joinMessage = addMessage({
      username: 'Admin',
      room: user.room,
      message: `${user.username} has joined the room`,
      isAdmin: true,
      type: 'join'
    });

    socket.broadcast.to(user.room).emit('message', joinMessage);

    // Send room data
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    // Send previous messages
    const roomMessages = getMessagesInRoom(user.room);
    socket.emit('previousMessages', roomMessages);

    callback();
  });

  // Send message
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    if (user) {
      const messageObj = addMessage({
        username: user.username,
        room: user.room,
        message,
        isAdmin: false,
        type: 'message'
      });

      io.to(user.room).emit('message', messageObj);
    }

    callback();
  });

  // Admin broadcast to all rooms
  socket.on('adminBroadcast', ({ message, adminKey }) => {
    if (adminKey === 'admin123') { // Simple admin authentication
      const broadcastMessage = {
        id: Date.now(),
        username: 'Admin',
        message: `📢 BROADCAST: ${message}`,
        timestamp: new Date(),
        isAdmin: true,
        type: 'broadcast'
      };

      // Add to all rooms
      const allRooms = [...new Set(users.map(user => user.room))];
      allRooms.forEach(room => {
        addMessage({
          username: 'Admin',
          room,
          message: broadcastMessage.message,
          isAdmin: true,
          type: 'broadcast'
        });
      });

      io.emit('message', broadcastMessage);
    }
  });

  // Private message
  socket.on('privateMessage', ({ targetUsername, message }) => {
    const sender = getUser(socket.id);
    const targetUser = users.find(user => user.username.toLowerCase() === targetUsername.toLowerCase());

    if (sender && targetUser) {
      const privateMsg = {
        id: Date.now(),
        username: sender.username,
        message: `[Private] ${message}`,
        timestamp: new Date(),
        isAdmin: false,
        type: 'private'
      };

      // Send to target user
      io.to(targetUser.socketId).emit('message', privateMsg);
      // Send confirmation to sender
      socket.emit('message', {
        ...privateMsg,
        message: `[Private to ${targetUsername}] ${message}`
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      const leaveMessage = addMessage({
        username: 'Admin',
        room: user.room,
        message: `${user.username} has left the room`,
        isAdmin: true,
        type: 'leave'
      });

      io.to(user.room).emit('message', leaveMessage);

      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }

    console.log(`User disconnected: ${socket.id}`);
  });
});

// API endpoints
app.get('/api/stats', (req, res) => {
  const totalUsers = users.length;
  const totalRooms = [...new Set(users.map(user => user.room))].length;
  const totalMessages = messages.length;

  res.json({
    totalUsers,
    totalRooms,
    totalMessages,
    rooms: [...new Set(users.map(user => user.room))].map(room => ({
      room,
      users: getUsersInRoom(room).length
    }))
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend should connect to: http://localhost:${PORT}`);
});
