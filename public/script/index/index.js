const socket = io();

const createRoomBtn = document.querySelector("#create-room");

createRoomBtn.addEventListener('click', () => {
    socket.emit('createRoom', socket.id);
});

socket.on('roomCreated', href => {
    document.location.href = href;
});