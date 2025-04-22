
const {io}=require('socket.io-client')

const socket=io('http://localhost:3000')

socket.on('message', (msg) => {
    console.log(`📨 Server: ${msg}`);
  });
socket.on('connect',()=>{
    console.log(`Connected as ${socket.id}`);
      // Send messages programmatically
  socket.send('Hello from client');

  
    socket.send('broadcast:Hello everyone!');


    socket.send('disconnect');
  
})
socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
  });