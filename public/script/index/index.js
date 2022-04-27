const socket = io();

const createRoomBtn = document.querySelector('#create-room');

createRoomBtn.addEventListener('click', () => {
    socket.emit('createRoom', socket.id);
});

socket.on('roomCreated', (href, roomId) => {
    document.location.href = href;
    localStorage.setItem('room-id', roomId);
});