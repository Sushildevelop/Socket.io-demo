// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize, User, ChatRoom, Message, UserChatRoom } = require('./models');

const app = express();
const server = http.createServer(app); // Create HTTP server from express app
const io = new Server(server); // Create a new Socket.IO server instance

app.use(express.json()); // Middleware to parse incoming JSON requests

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id); // Log new socket connection

  // Listen for joining a chat room
  socket.on('join-room', (roomId) => {
    console.log(`Socket ${socket.id} is attempting to join room ${roomId}`);
    socket.join(roomId); // Join the socket to a room
    console.log(`User joined room ${roomId}`);
  });

  // Listen for sending messages
  socket.on('send-message', async ({ senderId, roomId, content }) => {
    try {
      console.log(`Received message from user ${senderId} to room ${roomId}:`, content);
      // Save the message to the database
      const message = await Message.create({ senderId, chatRoomId: roomId, content });
      console.log('Message saved to database:', message.toJSON());

      // Retrieve full message details including sender
      const fullMessage = await Message.findByPk(message.id, { include: [User] });
      console.log('Full message with user details:', fullMessage.toJSON());

      // Emit the message to all users in the room
      io.to(roomId).emit('new-message', fullMessage);
      console.log(`Broadcasted message to room ${roomId}`);
    } catch (error) {
      console.error('Error while sending message:', error);
    }
  });
});

// REST API to create a user
app.post('/users', async (req, res) => {
  try {
    console.log('Creating new user with data:', req.body);
    const user = await User.create(req.body);
    console.log('User created:', user.toJSON());
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// REST API to create a chat room (group or individual)
app.post('/rooms', async (req, res) => {
  try {
    const { name, isGroup, userIds } = req.body;
    console.log('Creating chat room with:', req.body);
    const room = await ChatRoom.create({ name, isGroup }); // Create chat room
    console.log('Chat room created:', room.toJSON());
    await room.setUsers(userIds); // Associate users with the room
    console.log(`Users ${userIds} added to room ${room.id}`);
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// REST API to fetch messages of a chat room
app.get('/rooms/:id/messages', async (req, res) => {
  try {
    const roomId = req.params.id;
    console.log(`Fetching messages for room ${roomId}`);
    const messages = await Message.findAll({
      where: { chatRoomId: roomId },
      include: [User] // Include sender info
    });
    console.log(`Found ${messages.length} messages for room ${roomId}`);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
server.listen(3000, async () => {
  await sequelize.sync(); // Sync database models
  console.log('Database synced successfully');
  console.log('Server is running on http://localhost:3000');
});

// Sequelize models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read all model files and import them
fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Apply associations between models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

console.log('Sequelize models loaded:', Object.keys(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING // Username field
  });

  // Associations
  User.associate = (models) => {
    User.hasMany(models.Message, { foreignKey: 'senderId' }); // One user can send many messages
    User.belongsToMany(models.ChatRoom, { through: models.UserChatRoom }); // Users belong to many rooms
  };
  return User;
};

// models/chatroom.js
module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define('ChatRoom', {
    name: DataTypes.STRING, // Room name
    isGroup: DataTypes.BOOLEAN // Flag to identify group chats
  });

  // Associations
  ChatRoom.associate = (models) => {
    ChatRoom.belongsToMany(models.User, { through: models.UserChatRoom }); // Many users can join a room
    ChatRoom.hasMany(models.Message); // Room contains many messages
  };
  return ChatRoom;
};

// models/message.js
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: DataTypes.STRING // Message content
  });

  // Associations
  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: 'senderId' }); // Message has one sender
    Message.belongsTo(models.ChatRoom); // Message belongs to one room
  };
  return Message;
};

// models/userchatroom.js
module.exports = (sequelize, DataTypes) => {
  const UserChatRoom = sequelize.define('UserChatRoom', {}); // Junction table model
  return UserChatRoom;
};