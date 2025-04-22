
// console.log("hello");

const express=require('express')
const http=require('http')
const {Server}=require('socket.io')
const app=express()

const server=http.createServer(app)
const io=new Server(server)

io.on('connection',(socket)=>{
    console.log(`Client connected: ${socket.id}`);
    
    socket.emit('message',`Welcome ${socket.id}`)
    
    socket.on('message',(msg)=>{
        console.log(`${socket.id} : ${msg}`);
       if(msg==='disconnect'){
        socket.emit('message','Disconnecting.');
        socket.disconnect()
    }  
    
    if (msg.startsWith('broadcast:')) {
        const broadcastMsg = msg.replace('broadcast:', '');
        io.emit('message', `📢 From ${socket.id}: ${broadcastMsg}`);
      }
    socket.emit('message', `Echo: ${msg}`);
    })
    socket.on('disconnect', () => {
        console.log(`🔴 Client disconnected: ${socket.id}`);
    });
   
})
server.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});