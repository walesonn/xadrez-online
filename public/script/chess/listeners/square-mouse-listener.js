export default function addSquareMouseListeners(game) {
    
    const squares = [...document.querySelectorAll('#board .square')];
    
    /* Adicionando o listener em todos os quadrados do tabuleiro */
    squares.forEach(square => {
        square.addEventListener('mousedown', (e) => {
            squareMouseDownListener(e, game, square);
        });
    });

    function squareMouseDownListener(
        event, game, square
    ) {
        /* Se o jogador clicou em outra peça da mesma cor já 
        estando com uma peça selecionada, deseleciona-la */
        if (square.firstChild 
            && square.firstChild.classList.contains(game.state.playerColor) 
            && game.selectedPiece
        ) {
            game.selectedPiece = null;
            game.unpaintPossibleMoves();
        }
    
        /* Se o jogador clicou em outro quadrado já estando com uma peça
        selecionada, essa não é a primeira seleção dele */
        if (game.selectedPiece) 
            game.firstSelection = false;
    
        /* Se o jogador selecionar uma casa que contenha uma peça
        e se não houver peça selecionada
        e se a peça selecionada for uma peça do player (mesma cor)
        e se for o seu turno */
        if (square.firstChild 
            && game.selectedPiece === null
            && square.firstChild.classList.contains(game.state.playerColor)
            && game.state.isMyTurn
        ) {
            game.firstSelectionCall(square);
        }
        
        /* Se o jogador estiver com uma peça selecionada */
        if (game.selectedPiece && !game.firstSelection)
            game.secondSelectionCall(event, event.target);
    }
}