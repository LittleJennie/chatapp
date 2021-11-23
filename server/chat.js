const _ = require('lodash');
const uuid = require('uuid');

const messages = {};
const users = {};
const rooms = {};


class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    socket.on('getMessages', () => this.getMessages());
    socket.on('message', (msg) => this.addMessages(msg));
    socket.on('deleteMessage', (mid) => this.deleteMessage(mid))
    socket.on('messages', (room) => this.getMessages(room));
    socket.on('user', (user) => this.addUser(user));
    socket.on('getUser', (id) => this.getUser(id));
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  getUser(id) {
    const user = users[id];
    this.io.sockets.emit('user', user);
  }

  addUser(user) {
    const userId = uuid.v4();
    users[userId] = { id: userId, username: user.username, room: user.room };
    if (!rooms[user.room]) {
      rooms[user.room] = [userId];
    } else
    rooms[user.room] ? rooms[user.room].push(userId) : rooms[user.room] = [userId];
    this.getUser(userId);

    this.socket.emit('roomUsers', { room: user.room, users: rooms[user.room] });
  }

  deleteMessage(msg) {
    delete messages[msg.id];
    this.getMessages(msg.room)
  }

  sendMessage(message) {
    const user = users[message.userId];
    this.io.sockets.emit('message', { ...message, username: user.username });
  }

  getMessages(room) {
    _.each(messages, m => {
      if (m.room === room) this.sendMessage(m);
    });
  }

  addMessages(meta) {
    const message = {
      id: uuid.v4(),
      userId: meta.userId,
      message: meta.val,
      time: Date.now(),
      room: meta.room,
    };

    messages[message.id] = message;
    this.sendMessage(message);
  }

  disconnect(id) {
    delete users[id];
  }
}

function chat(io) {
  io.on('connection', (socket) => {
    new Connection(io, socket);
  });
}

module.exports = chat;
