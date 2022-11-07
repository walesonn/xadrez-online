export default function initializeMessageBox() {

  const modal = document.getElementById('message-box-modal');
  const copyButton = document.getElementById('message-box-copy');
  const closeButton = document.getElementById('message-box-close');
  const messageDiv = document.getElementById('message');

  copyButton.onclick = () => {
    /* Copiar o URL da página para a área de transferência */
    navigator.clipboard.writeText(window.location.href);

    modal.style.display = 'none';
    copyButton.style.display = 'none';
  }

  closeButton.onclick = () => {
    modal.style.display = 'none';
  }

  /* Quando o usuário clicar em qualquer local fora do modal, fechar ele */
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

  function loadPageOnClose(href) {
    closeButton.onclick = () => {
      window.location.href = href;
    }

    window.onclick = (e) => {
      if (e.target == modal)
        window.location.href = href;
    }
  }

  return {
    show,
    clearPiecesOnClose,
    loadPageOnClose
  }
}