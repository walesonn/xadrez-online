import { Server } from 'socket.io';
import express from 'express';
import crypto from 'crypto';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const host = 'localhost';
const port = 3000;

const gameRooms = [];

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

function createRoom() {
    const room = {
        id: null,
        isClosed: false,
        darkId: null,
        whiteId: null
    }

    return room;
}

function closeRoom(roomId) {
    for (let i = 0; i < gameRooms.length; i++) {
        if (gameRooms[i].id == roomId) {
            gameRooms[i].isClosed = true;
            break;
        }
    }
}

io.on('connection', socket => {
    /* Ao receber o evento de desconexão de um client */
    socket.on('disconnect', () => {
        let url = socket.handshake.headers.referer.split('/');
        let roomId = url[3];
        
        /* Se o client estiver dentro de uma sala de jogo */
        if (roomId != undefined && roomId.length == 30) {
            console.log(`> Jogador [${socket.id}] desconectado`);
            
            closeRoom(roomId);
            io.to(roomId).emit('playerDisconnected', `http://${host}:${port}`);
        }
    });

    /* Ao receber uma solicitação de criar uma sala por um jogador */
    socket.on('createRoom', socketId => {
        const roomId = crypto.randomBytes(15).toString('hex');
        
        app.get(`/${roomId}`, (req, res) => {
            res.sendFile('chess.html', { root: 'public' });
        });

        io.to(socketId).emit(
            'roomCreated', `http://${host}:${port}/${roomId}`, roomId
        );
    });

    /*Ao receber o evento de que um jogador entrou na sala*/
    socket.on('enteredRoom', roomId => {   
        socket.join(roomId);
        console.log(`> Player [${socket.id}] connected in room [${roomId}]`);

        let room = null;

        /*Verificando se a sala já foi criada*/
        gameRooms.forEach(e => {
            if (e.id == roomId)
                room = e;
        });

        /*Se a sala existir*/
        if (room) {
            if (room.darkId === null) room.darkId = socket.id;
            else if (room.whiteId === null) room.whiteId = socket.id;
            
            /*Manda o comando de iniciar o jogo para 
            ambos os jogadores*/
            io.to(roomId).emit(
                'startGame', room, `http://${host}:${port}`);
        } else {
            const room = createRoom();
            room.id = roomId;
            room.whiteId = socket.id;
            
            gameRooms.push(room);

            /*Como este é o primeiro jogador, exibir uma
            mensagem com um botão disponível para copiar o
            link do site*/
            socket.emit('showSendLinkMessage');
        }
    });

    /* Ao receber o evento de uma peça mexida por um jogador */
    socket.on('pieceMoved', (
        mirroredOldPosition,
        mirroredNewPosition, 
        roomId
    ) => {
        /* Mandando o movimento espelhado para o outro jogador */
        socket
            .broadcast.to(roomId)
            .emit('pieceMoved', mirroredOldPosition, mirroredNewPosition);
    });
    
    /* Ao receber o evento de jogo terminado */
    socket.on('gameEnded', command => {
        closeRoom(command.roomId);
    });
});

server.listen(port, host, () => {
    console.log(`Listening at ${host}:${port}`);
});