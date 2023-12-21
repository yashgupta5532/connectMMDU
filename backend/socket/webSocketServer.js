import WebSocket from "ws"

const server=new WebSocket.Server({port:3001});

server.on('connection',(socket)=>{
    console.log("connection established",socket);

    socket.on('message',(message)=>{
        console.log(`Received message is ${message}`)
    })

})
