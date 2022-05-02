export default function addMouseListeners(game) {
    
    let offset = [0, 0];
    let isDown = false;
    let movingFrom; /* HTMLDivElement */
    let piece; /* HTMLDivElement */
    
    function onMouseMove(e) {
        e.preventDefault();
    
        if (isDown) {
            let mousePosition = {
                x: e.clientX,
                y: e.clientY
            };
    
            let left = (mousePosition.x + offset[0]);
            let top = (mousePosition.y + offset[1]);
    
            piece.style.left = left + "px";
            piece.style.top = top + "px";
        }
    }
    
    function onMouseUp(e) {
        if (!isDown) return;
        isDown = false;
    
        let squareOver;
    
        let mousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    
        /* Iterando entre cada quadrado do tabuleiro e vendo se o mouse está
        encima de algum deles */
        [...document.querySelectorAll(".square")].forEach(square => {
            let rect = square.getBoundingClientRect();
    
            /* Se a posição X do mouse for maior que o X do canto esquerdo do quadrado
            e menor que o X do canto direito do quadrado
            e se a posição Y do mouse for maior que o Y do canto superior do quadrado
            e menor que o Y do canto inferior do quadrado
            e se este quadrado não for o mesmo que a peça estava */
            if (mousePosition.x >= rect.x && mousePosition.x <= rect.x + rect.width
                && mousePosition.y >= rect.y && mousePosition.y <= rect.y + rect.height
                && movingFrom && square.id != movingFrom.id
            ) {
                /* Então esse é o novo quadrado que a peça está encima */
                squareOver = square;
            }
        });
    
        if (squareOver)
            game.secondSelectionCall(e, squareOver, true);
     
        if (!piece) return;
        
        piece.style.position = 'static';
        piece.style.left = 'auto';
        piece.style.top = 'auto';
        piece.style.zIndex = '1000';
        
        piece.style.height = '60px';
        piece.style.width = '60px';
    }
    
    function onMouseDown(e) {
        /* Se o target do evento ter a classe "chess-piece" 
        e se for uma peça que o player possa mexer (peça de sua cor)
        e se for o seu turno */
        if (e.target.classList.contains('chess-piece')
            && !e.target.classList.contains('choice')
            && e.target.classList.contains(game.state.playerColor)
            && game.state.isMyTurn
        ) {
            isDown = true;
            
            piece = e.target;
            piece.style.position = 'absolute';
            piece.style.zIndex = 1001;
            
            piece.style.height = '70px';
            piece.style.width = '70px';
    
            movingFrom = e.target.parentNode;
    
            offset = [
                piece.offsetLeft - e.clientX,
                piece.offsetTop - e.clientY
            ];
        }
    }

    /* Adicionando os listeners */
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}