import crypto from 'crypto';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const host = 'localhost';
const port = 3000;

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile('main.html', { root: 'public' });
});

function createRoom() {
    const room = {
        id: null,
        darkId: null,
        whiteId: null,
        boardMap: null
    }

    return room;
}

/*Array de objetos "room"*/
const gameRooms = [];

function removePlayer(socketId) {
    gameRooms.forEach(room => {
        if (room.darkId == socketId)
            room.darkId = null;
        else if (room.whiteId == socketId)
            room.whiteId = null;
    });
}

io.on('connection', socket => {
    console.log(`> Socket conectado: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`> Socket desconectado: ${socket.id}`);
        removePlayer(socket.id);
    });

    /*Ao tentar criar uma sala*/
    socket.on('createRoom', socketId => {
        const roomId = crypto.randomBytes(15).toString('hex');
        
        app.get(`/${roomId}`, (req, res) => {
            res.sendFile('chess.html', { root: 'public' });
        });

        io.to(socketId).emit(
            'roomCreated', `http://${host}:${port}/${roomId}`
        );
    });

    /*Ao entrar na sala*/
    socket.on('enteredRoom', (socketId, roomId) => {   
        let roomAlreadyCreated = false;
        
        const enteredSocket = io.sockets.sockets.get(socketId);
        enteredSocket.join(roomId);
        
        gameRooms.forEach(room => {
            /*Se essa sala já existe no servidor*/
            if (room.id == roomId) {
                roomAlreadyCreated = true;

                if (room.darkId === null)
                    room.darkId = socketId;
                else if (room.whiteId === null)
                    room.whiteId = socketId;
            
                /*Emitindo evento para sala começar o jogo*/
                io.to(roomId).emit('startGame', room);
            }
        });

        if (!roomAlreadyCreated) {
            const room = createRoom();
            room.id = roomId;
            room.whiteId = socketId;
            
            gameRooms.push(room);
        }
    });

    socket.on('opponentPieceMoved', (roomId, oldPosition, newPosition) => {
        socket.to(roomId).emit('opponentMovePiece', oldPosition, newPosition);
    });
});

server.listen(port, host, () => {
    console.log(`Listening at ${host}:${port}`);
});