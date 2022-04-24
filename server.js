const crypto = require("crypto");

const express = require("express");
const path = require("path");

const app = express();
const http = require('http');
const server = http.createServer(app);

/*Socket.IO*/
const { Server } = require('socket.io');
const io = new Server(server);

const host = 'localhost';
const port = 3000;

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, 'main.html'));
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
            res.sendFile(path.join(publicPath, 'chess.html'))
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