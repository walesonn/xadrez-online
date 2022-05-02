const socket = io();

const createRoomBtn = document.querySelector('#create-room');

const howWorksModal = document.querySelector('#how-works-modal');
const howWorksOpenBtn = document.querySelector('#how-works-open');
const howWorksCloseBtn = document.querySelector('#how-works-close');

createRoomBtn.addEventListener('click', () => {
    socket.emit('createRoom', socket.id);
});

howWorksOpenBtn.addEventListener('click', () => {
    howWorksModal.style.display = 'block';
});

howWorksCloseBtn.addEventListener('click', () => {
    howWorksModal.style.display = 'none';
});

socket.on('roomCreated', (href, roomId) => {
    document.location.href = href;
    localStorage.setItem('room-id', roomId);
});