export default function initializeMessageBox() {
    const modal = document.getElementById('message-box-modal');
    const copyButton = document.getElementById('message-box-copy');
    const closeButton = document.getElementById('message-box-close');
    const messageDiv = document.getElementById('message');
    
    copyButton.onclick = () => {
        navigator.clipboard.writeText(window.location.href);

        modal.style.display = 'none';
        copyButton.style.display = 'none';
    }

    closeButton.onclick = () => {
        modal.style.display = 'none';
    }
    
    /*When the user clicks anywhere outside of the modal, close it*/
    window.onclick = (e) => {
        if (e.target == modal)
            modal.style.display = 'none';
    }

    function show(message, enableCoppyButton = false) {
        messageDiv.innerHTML = message;
        modal.style.display = 'block';

        if (enableCoppyButton)
            copyButton.style.display = 'block';
    }

    function clearPiecesOnClose(game) {
        closeButton.onclick = () => {
            game.clearPieces();
            modal.style.display = 'none';
        }

        window.onclick = (e) => {
            if (e.target == modal) {
                game.clearPieces();
                modal.style.display = 'none';
            }
        }
    }

    return { show, clearPiecesOnClose }
}