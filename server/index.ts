import express, {Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {Server} from 'socket.io'
import http from 'http'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin: 'http://localhost:5173',
        methods: ["GET", "POST" ],
     },
})

io.on('connection', socket =>{
    console.log('Connected to Websocket server', socket.id)

    socket.on('join_room', data =>{
        socket.join(data.room)
        console.log(`${data.username} has joined the room '${data.room}'`)
    });

    socket.on('send_message', data =>{
        console.log(`${data.username} said "${data.message}"`)
        socket.to(data.room).emit('receive_message', data)
    })
});



app.use(express.json()); 

server.listen(PORT,() =>{
    console.log(`Server running in port ${PORT}`)
})