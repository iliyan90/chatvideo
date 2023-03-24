import express from 'express'
const app = express();
import http from 'http'
const server = http.createServer(app);
import cors from 'cors'
import { Server } from 'socket.io';


const io = new Server(server, {
    cors: '*',
    method: ["GET", "POST"]
});
const corsOptions = {
    origin: 'http://videochat77.rf.gd',
    credentials: true
  }
app.use(cors(corsOptions));

const PORT = 3001;

app.get('/',(req, res) => {
    res.send('Server is running')
})

io.on('connection', (socket) =>{
    socket.emit('me', socket.id)
    socket.on('disconnect', () =>{
        socket.broadcast.emit('callended')
    });
    socket.on('calluser', ({userToCall, signalData, from, name}) =>{
        io.to(userToCall).emit('calluser', {signal: signalData, from, name})
    })
    socket.on('answercall', (data) =>{
        io.to(data.to).emit('callaccepted', data.signal);
    })
})

server.listen(PORT, () =>{
    console.log('connected to: ', PORT);
})

