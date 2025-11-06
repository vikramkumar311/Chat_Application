# Real-time Chat Application Setup Guide

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install all dependencies (root, server, and client)
   npm run install-all
   ```

2. **Start the Application**
   ```bash
   # Start both server and client simultaneously
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1: Start the server
   npm run server
   
   # Terminal 2: Start the client
   npm run client
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
Chat_Application/
├── package.json              # Root package.json with scripts
├── README.md                 # Project documentation
├── .gitignore               # Git ignore file
├── SETUP.md                 # This setup guide
├── server/                  # Backend Node.js application
│   ├── package.json         # Server dependencies
│   └── index.js            # Main server file with Socket.io
└── client/                  # Frontend React application
    ├── package.json         # Client dependencies
    ├── public/             # Static files
    └── src/
        ├── components/      # React components
        │   ├── Join.js     # Login/Join page
        │   ├── Chat.js     # Main chat interface
        │   ├── Message.js  # Message component
        │   ├── UsersList.js # Online users list
        │   └── AdminPanel.js # Admin broadcast panel
        ├── App.js          # Main App component
        ├── App.css         # Main styles
        ├── index.js        # React entry point
        └── index.css       # Global styles
```

## 🎯 Features Implemented

### Frontend (React)
✅ **Login/Join Page**
- Username and room number input
- Form validation (empty username check)
- Error messaging
- Modern UI with gradient styling

✅ **Chat Interface**
- Real-time message display with timestamps
- Current user vs others message differentiation
- Admin message styling
- System messages (join/leave notifications)
- Online users list with avatars
- Message input with emoji support

✅ **Additional Features**
- Private messaging (@username functionality)
- Admin broadcast panel
- Responsive design for mobile
- Auto-scroll to latest messages
- Typing indicators
- User avatars with initials

### Backend (Node.js + Express + Socket.io)
✅ **Server Setup**
- Express server with CORS enabled
- Socket.io integration
- RESTful API endpoints

✅ **Socket.io Features**
- Room-based chat system
- User join/leave notifications
- Message broadcasting within rooms
- Admin broadcast to all rooms
- Online user tracking per room
- Private messaging system

✅ **Data Storage**
- In-memory arrays for users and messages
- User data: `{ username, room, socketId, joinTime }`
- Message data: `{ id, username, room, message, timestamp, isAdmin, type }`

## 🔧 Technical Details

### Dependencies
**Server:**
- `express`: Web server framework
- `socket.io`: Real-time communication
- `cors`: Cross-origin resource sharing
- `nodemon`: Development server auto-restart

**Client:**
- `react`: Frontend framework
- `react-router-dom`: Client-side routing
- `socket.io-client`: Socket.io client library

### Scripts Available
```bash
npm run dev          # Start both server and client
npm run server       # Start server only
npm run client       # Start client only
npm run install-all  # Install all dependencies
npm run build        # Build for production
npm start           # Start production server
```

## 🎮 How to Use

1. **Join a Room**
   - Enter your username (minimum 2 characters)
   - Enter a room number (any string/number)
   - Click "Join Chat Room"

2. **Send Messages**
   - Type in the message input and press Enter or click send
   - Messages appear in real-time for all users in the room

3. **Private Messages**
   - Use `@username your message` format
   - Only the target user and sender will see the private message

4. **Admin Broadcasts**
   - Click "Show Admin Panel" in the sidebar
   - Enter admin key: `admin123`
   - Type broadcast message and send
   - Message will appear in all rooms

5. **View Online Users**
   - See all users currently in your room
   - User avatars show initials with unique colors
   - Join times are displayed

## 🚨 Troubleshooting

### Common Issues

1. **Cannot connect to server**
   - Make sure the server is running on port 5000
   - Check if there are any port conflicts

2. **Socket connection errors**
   - Verify both frontend and backend are running
   - Check browser console for error messages

3. **Admin broadcast not working**
   - Use the correct admin key: `admin123`
   - Make sure you're entering both the key and message

### Port Configuration
- Server runs on port 5000 (configurable via PORT environment variable)
- Client runs on port 3000 (React default)
- Socket.io connects to `http://localhost:5000`

## 🌟 Optional Features Implemented

✅ **Private messaging** - Use @username format
✅ **Message formatting** - Different styles for different message types
✅ **Auto-scroll** - Automatically scrolls to latest messages
✅ **Online user count** - Shows total users in current room
✅ **User avatars** - Colorful avatars with user initials
✅ **Responsive design** - Works on mobile and desktop
✅ **Typing indicators** - Shows when users are typing
✅ **Join/leave timestamps** - Shows when users joined

## 🔒 Security Notes

- Admin key is hardcoded as `admin123` for demo purposes
- In production, use environment variables for sensitive data
- No persistent authentication implemented
- Messages are stored in memory and reset on server restart

## 🎨 Styling

The application uses a modern gradient design with:
- Purple/blue gradient background
- Card-based UI components
- Smooth transitions and hover effects
- Responsive design for mobile devices
- Custom scrollbar styling
- Color-coded messages for different types

Enjoy your real-time chat application! 💬✨
