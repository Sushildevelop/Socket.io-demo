
// console.log("Hello world");
const express=require('express')
const http=require('http')
const path=require('path')
const socketIO=require('socket.io')

const app=express()
const server=http.createServer(app)

const io=socketIO(server)

// In-memory users and message 
let users={};
let messages=[];

io.on('connection',(socket)=>{
    console.log(`New Client: ${socket.id}`);
    
    // Join Chat
    socket.on('join',(username)=>{
        users[socket.id]=username;
        socket.broadcast.emit('message',`${username} joined the chat` )
        console.log(`${username} connected`);
        
    })
      

    socket.on('chatMessage',(msg)=>{
        const username=users[socket.id] || 'Unknown';
        const message={user:username,text:msg};
        messages.push(message);
        io.emit('message',message)
        if(msg==='disconnect'){
            socket.emit('message','Disconnecting.');
            socket.disconnect()
            
        }
        
    })

    // Disconnect
    socket.on('disconnect',()=>{
        const username=users[socket.id] || 'Someone';
        
        socket.broadcast.emit('message',`${username} left the chat`)
        delete users[socket.id]
    })









})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
server.listen(4500,()=>{
    console.log(`Server running at http://localhost:4500`);
    
})