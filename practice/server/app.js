
import express from "express";
import {WebSocketServer} from "ws";

const app=express()
const port=8000

const server=app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
})

const wss=new WebSocketServer({server})

wss.on("connection",(ws)=>{
    ws.send('Welcome to the WebSocket server!');
    ws.send('welcome to the websocket server and socket.io')
    ws.on('message',(data)=>{
        console.log("Data of client",data);
        ws.send("Thanks spirehubs")
        ws.emit("cOOL")
        
        
    })
    // ws.on('close', () => {
    //     console.log('Client disconnected');
    //   });
    
//  ws.send(setTimeout(()=>{
//    console.log('Client disconnected');
//    ws.send('Bhaiya Disconnected')
   
//     },3000))
})