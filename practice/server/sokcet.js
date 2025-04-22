const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection',(socket)=>{
    console.log(`Client connected: ${socket.id}`);

	socket.on('message', (msg)=>{
		console.log('Message is ',msg);


        // Respond to client with "hello client"
         socket.broadcast.emit('message', 'hello client')

        if(msg==='disconnect'){
            socket.emit('message','Disconnecting.');
            socket.disconnect()
        } 
      
	})

    
	// socket.on('disconnect', function(msg){
    //     socket.broadcast.emit('broadcast',msg)
	// 	console.log('Disconnected');
	// })
  
});

http.listen(9000, function(){
	console.log('Listening to port 9000');
})
