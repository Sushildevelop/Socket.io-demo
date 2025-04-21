const http=require('http');
const express=require('express');
const path=require("path");
const { Server } = require('socket.io');

const app=express()
const server=http.createServer(app)
const io = new Server(server);

// Socket.io
io.on('connection',(socket)=>{
    // console.log("A new user has connected",socket.id);
    socket.on('User-message',(message)=>{
        // console.log('A new user message ',message);
        io.emit('message',message)
        
    })
    
})

app.use(express.static(path.resolve("./public")))
app.get('/',(req,res)=>{
    return res.sendFile("/public/index.html")
})
server.listen(9000,()=>{
    console.log(`Server started at the 9000`);
    
})