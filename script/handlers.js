function paintSquares(walkPositions, attackPositions) {
    walkPositions.forEach(position => {
        let currentSquare = document.querySelector(`#square${position}`);
        
        currentSquare.style.filter = "grayscale(100%) brightness(80%) sepia(300%) hue-rotate(50deg) saturate(500%) drop-shadow(0 0 0.75rem green)";
        currentSquare.style.border = "1px #000706 solid";
    });

    attackPositions.forEach(position => {
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
    whereCanWalk.concat(whereCanAttack).forEach(position => {
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
    whereCanAttack = pieceObj.whereCanAttack(selectedPiecePosition);

    /*Pinta os quadrados em que a peça pode se mover*/
    paintSquares(whereCanWalk, whereCanAttack);

    firstSelection = true;
}

/*Função chamada quando o player clica em um novo quadrado estando
com uma peça selecionada*/
function secondSelectionCall(square, invokedByDragAndDrop = false) {
    /*Pega a posição selecionada*/
    let positionClicked = parseInt(square.id.replace("square", ""));

    /*Se ele pode andar para aquela posição*/
    if (whereCanWalk && whereCanWalk.includes(positionClicked)) {
        /*Se não houver peças naquela posição*/
        if (boardMap.get(positionClicked) == null) {
            
            // TODO: se houver peças inimigas e o player mover até elas, tirar elas do tabuleiro
            // Despintar as partes que não se pode andar
            
            boardMap.set(selectedPiecePosition, null);
            boardMap.set(positionClicked, pieceObj);
            pieceObj.moveTo(positionClicked);
    
            unpaintSquares();
        }
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