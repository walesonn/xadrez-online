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
        /*Movendo a peça para o lugar clicado*/
        pieceObj.moveTo(positionClicked)

        /*Checando se o player de um check no rei inimigo*/
        let possibleMoves = boardMap.get(positionClicked)
            .getPossibleMoves(positionClicked);

        possibleMoves.attackPositions.forEach(e => {
            let piece = boardMap.get(e);
            if (piece.constructor.name.toLowerCase() != PieceType.King) return;

            /*TODO: Mandar mensagem pro outro jogador e rodar
            os seguintes comandos pra ele (obs: ainda precisa proibir o movimento
            de outras peças):

            isKingInCheck = true;

            messageBox.innerHTML = isInCheck;
            messageBox.classList.toggle("hidden");
            */
        });
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

/*Função que manda a jogada espelhada para o outro jogador, atualizando
a mesa do modo correto*/
function mirrorPlayToServer(oldPosition, newPosition) {
    let oldPositionCoord = BoardCoord.toCoord(oldPosition); 
    let newPositionCoord = BoardCoord.toCoord(newPosition);

    /*Espelhando o movimento para mandar para o adversário*/
    const mirroredOldPosition = new Coord(oldPositionCoord.x, (8 - oldPositionCoord.y) + 1);

    const yOffset = (oldPositionCoord.y - newPositionCoord.y);
    const mirroredNewPosition = new Coord(newPositionCoord.x, mirroredOldPosition.y + yOffset);

    socket.emit(
        'opponentPieceMoved',
        roomId,
        mirroredOldPosition.toNumber(),
        mirroredNewPosition.toNumber()
    );
}