const chat = require('./chat');
const socketio = require('socket.io');

const app = require('./app');
const http = require('http');

app.set('port', '3000');

const server = http.createServer(app);
const io = socketio(server,{
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
chat(io);

server.listen('3000');
server.on('listening', () => {
  console.log('listening to port 3000 now')
});
