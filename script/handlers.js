function paintSquares(positions) {
    positions.forEach(position => {
        document.querySelector(`#square${position}`)
            .style.filter = "grayscale(100%) brightness(80%) sepia(300%) hue-rotate(50deg) saturate(500%) drop-shadow(0 0 0.75rem green)";

        document.querySelector(`#square${position}`)
            .style.border = "1px #000706 solid";
    });
}

function unpaintSquares(positions) {
    positions.forEach(position => {
        document.querySelector(`#square${position}`)
            .style.filter = "";

        document.querySelector(`#square${position}`)
            .style.border = "";
    });
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
    whereCanWalk = pieceObj.whereCanWalk(selectedPiecePosition);

    /*Pinta os quadrados em que a peça pode se mover*/
    paintSquares(whereCanWalk);

    firstSelection = true;
}

/*Função chamada quando o player clica em um novo quadrado estando
com uma peça selecionada*/
function secondSelectionCall(square, invokedByDragAndDrop = false) {
    /*Pega a posição selecionada*/
    let positionClicked = parseInt(square.id.replace("square", ""));

    /*Se ele pode andar para aquela posição*/
    if (whereCanWalk && whereCanWalk.includes(positionClicked)) {
        /*Se houver peças naquela posição*/
        if (boardMap.get(positionClicked) != null) {
            // TODO
            return;
        }

        boardMap.set(selectedPiecePosition, null);
        boardMap.set(positionClicked, pieceObj);
        pieceObj.moveTo(positionClicked);

        unpaintSquares(whereCanWalk);
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
        unpaintSquares(whereCanWalk);
    }

    // TODO
    // if (podeIr && nãoTemPeçaSuaNoCaminho)
}