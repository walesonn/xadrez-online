function paintSquares(possibleMoves) {
    possibleMoves.walkPositions.forEach(position => {
        let currentSquare = document.querySelector(`#square${position}`);
        
        currentSquare.style.filter = "grayscale(100%) brightness(80%) sepia(300%) hue-rotate(50deg) saturate(500%) drop-shadow(0 0 0.75rem green)";
        currentSquare.style.border = "1px #000706 solid";
    });

    possibleMoves.attackPositions.forEach(position => {
        let currentSquare = document.querySelector(`#square${position}`);
        
        /*Adicionar filtro vermelho e borda ao quadrado*/
        currentSquare.style.filter = "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)";
        currentSquare.style.border = "1px #000706 solid";
    });
}

function unpaintSquares() {
    possibleMoves.walkPositions.forEach(position => {
        clearFilterAndBorder(document.querySelector(`#square${position}`));
    });

    possibleMoves.attackPositions.forEach(position => {
        clearFilterAndBorder(document.querySelector(`#square${position}`));
    });
}

function clearFilterAndBorder(element) {
    element.style.filter = "";
    element.style.border = "";
}

/*Função chamada quando uma peça é selecionada*/
function firstSelectionCall(context) {
    selectedPiece = context.firstChild;

    selectedPiecePosition = parseInt(
        selectedPiece.parentNode.id.replace("square", "")
    );

    /*De acordo com a posição da peça selecionada, pegar a 
    instância dela no Map "boardMap"*/
    pieceObj = boardMap.get(selectedPiecePosition);

    /*Pega um array com as posições que essa peça pode andar
    Obs: não leva em conta obstáculos no caminho*/
    possibleMoves = pieceObj.getPossibleMoves(selectedPiecePosition);

    /*Pinta os quadrados em que a peça pode se mover*/
    paintSquares(possibleMoves);

    firstSelection = true;
}

/*Função chamada quando o player clica em um novo quadrado estando
com uma peça selecionada*/
function secondSelectionCall(target, invokedByDragAndDrop = false) {
    let positionClicked;
    
    /*Pega a posição selecionada (de maneiras diferentes caso a seleção
    tenha sido a div do quadrado ou a img da peça)*/
    target.classList.contains("chess-piece") 
        ? positionClicked = parseInt(target.parentNode.id.replace("square", ""))
        : positionClicked = parseInt(target.id.replace("square", ""));

    /*Booleana que checa se pelo menos um dos arrays não está vazio*/
    let arrayNotEmpty = possibleMoves.walkPositions.length > 0 
        || possibleMoves.attackPositions.length > 0;
    
    /*Booleana que checa se a posição clicada está entre os movimentos possíveis*/
    let legalMoveSelected = possibleMoves.walkPositions.includes(positionClicked) 
        || possibleMoves.attackPositions.includes(positionClicked);
    
    /*Se há jogadas disponíveis e ele pode andar para aquela posição*/
    if (arrayNotEmpty && legalMoveSelected) {
        /*Caso na nova posição tenha uma uma peça inimiga e ela estiver
        no array de possíveis jogadas de ataque, tirar ela do tabuleiro*/
        if (possibleMoves.attackPositions.includes(positionClicked)) {
            let piece = boardMap.get(positionClicked);
            // piece.parentNode.removeChild(piece);
        }

        /*Mover a peça até a posição clicada*/
        pieceObj.moveTo(positionClicked);
    }

    /*Se essa função não foi invocada após um drag and drop
    e se o quadrado conter um filho sendo da cor do player
    e se não houver peça selecionada
    Marcar uma nova seleção*/
    if (!invokedByDragAndDrop
        && target.firstChild
        && target.firstChild.classList.contains(playerColor)
        && selectedPiece === null
    ) {
        firstSelectionCall(target);
    } else {
        selectedPiece = null
        unpaintSquares();
    }
}