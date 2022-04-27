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
    res.sendFile('index.html', { root: 'public' });
});

function createRoom() {
    const room = {
        id: null,
        darkId: null,
        whiteId: null
    }

    return room;
}

/*Array de objetos "room"*/
const gameRooms = [];

function removePlayer(socketId) {
    gameRooms.forEach(room => {
        if (room.darkId == socketId) room.darkId = null;
        else if (room.whiteId == socketId) room.whiteId = null;
    });
}

io.on('connection', socket => {
    socket.on('disconnect', () => {
        let urlRoomId = socket.handshake.headers.referer.split('/');
        
        if (urlRoomId[3] != undefined && urlRoomId[3].length == 30) {
            console.log(`> Jogador [${socket.id}] desconectado`);
            removePlayer(socket.id);
        }
    });

    /*Ao receber uma solicitação de criar uma sala por um client*/
    socket.on('createRoom', socketId => {
        const roomId = crypto.randomBytes(15).toString('hex');
        
        app.get(`/${roomId}`, (req, res) => {
            res.sendFile('chess.html', { root: 'public' });
        });

        io.to(socketId).emit(
            'roomCreated', `http://${host}:${port}/${roomId}`, roomId
        );
    });

    /*Ao entrar na sala*/
    socket.on('enteredRoom', (socketId, roomId) => {   
        console.log(`> Player [${socketId}] connected in room [${roomId}]`);

        let roomAlreadyCreated = false;
        
        const enteredSocket = io.sockets.sockets.get(socketId);
        enteredSocket.join(roomId);
        
        gameRooms.forEach(room => {
            /*Se essa sala já existe no servidor*/
            if (room.id == roomId) {
                roomAlreadyCreated = true;

                if (room.darkId === null) room.darkId = socketId;
                else if (room.whiteId === null) room.whiteId = socketId;
                
                /*Emitindo evento para sala começar o jogo*/
                io.to(roomId).emit('startGame', room);
            }
        });

        /*Se a sala ainda não foi criada*/
        if (!roomAlreadyCreated) {
            const room = createRoom();
            room.id = roomId;
            room.whiteId = socketId;

            /*Como este é o primeiro jogador, exibir uma
            mensagem com um botão disponível para copiar o
            link do site*/
            socket.emit('showSendLinkMessage');
            
            gameRooms.push(room);
        }
    });

    socket.on('pieceMoved', (
        mirroredOldPosition,
        mirroredNewPosition, 
        roomId
    ) => {
        /*Mandando o movimento espelhado para o outro jogador*/
        socket
            .broadcast.to(roomId)
            .emit('pieceMoved', mirroredOldPosition, mirroredNewPosition);
    });

    socket.on('gameEnded', command => {
        let { roomId } = command;

        gameRooms.forEach((room, index) => {
            if (roomId == room.id) 
                gameRooms.splice(index, 1);
        });
    });
});

server.listen(port, host, () => {
    console.log(`Listening at ${host}:${port}`);
});