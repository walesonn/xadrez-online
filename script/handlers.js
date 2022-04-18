function paintSquares(possibleMoves) {
    possibleMoves.walkPositions.forEach(position => {
        let currentSquare = document.querySelector(`#square${position}`);
        
        currentSquare.style.filter = "grayscale(100%) brightness(80%) sepia(300%) hue-rotate(50deg) saturate(500%) drop-shadow(0 0 0.75rem green)";
        currentSquare.style.border = "1px #000706 solid";
    });

    possibleMoves.attackPositions.forEach(position => {
        let currentSquare = document.querySelector(`#square${position}`);
        
        /*Se nesta posição houver uma peça e ela for da cor do adversário*/
        if (
            boardMap.get(position) != null
            && !currentSquare.classList.contains(playerColor)
        ) {
            /*Adicionar filtro vermelho e borda ao quadrado*/
            currentSquare.style.filter = "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)";
            currentSquare.style.border = "1px #000706 solid";
        }
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
function secondSelectionCall(square, invokedByDragAndDrop = false) {
    /*Pega a posição selecionada*/
    let positionClicked = parseInt(square.id.replace("square", ""));

    /*Se ele pode andar para aquela posição*/
    if (possibleMoves.walkPositions.length > 0 
        && (possibleMoves.walkPositions.includes(positionClicked)
        || possibleMoves.attackPositions.includes(positionClicked))
    ) {
        /*Setar a posição a qual a peça selecionada está saindo para null*/
        boardMap.set(selectedPiecePosition, null);

        /*Mover a peça até a posição clicada*/
        pieceObj.moveTo(positionClicked, pieceObj);

        /*Caso na nova posição tenha uma uma peça inimiga e ela estiver
        no array de possíveis jogadas de ataque, tirar ela do tabuleiro*/
        if (possibleMoves.attackPositions.includes(positionClicked))

        unpaintSquares();
    }

    /*Se essa função não foi invocada após um drag and drop
    e se o quadrado conter um filho
    e se não houver peça selecionada
    e se a peça for da cor das peças do player
    Marcar uma nova seleção*/
    if (!invokedByDragAndDrop
        && square.firstChild
        && selectedPiece === null
        && square.firstChild.classList.contains(playerColor)
    ) {
        firstSelectionCall(square);
    } else {
        selectedPiece = null
        unpaintSquares();
    }

    // TODO
    // if (podeIr && nãoTemPeçaSuaNoCaminho)
}