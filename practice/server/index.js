
import express from "express";
import {WebSocketServer} from "ws"
const app=express();
const port=8000;

const server=app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
    
})

const wss=new WebSocketServer({server})

wss.on("connection",(ws)=>{
    ws.on("message",(data)=>{
        // console.log("Data from client : %s", data);
        console.log("Data from client :", data);

        ws.send("Thanks Buddy")
        
    })
})