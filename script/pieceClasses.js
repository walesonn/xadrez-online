const PieceColor = { 
    White: "white", 
    Dark: "dark" 
};

const PieceType = { 
    Rook: "rook",
    Horse: "horse",
    Bishop: "bishop",
    Queen: "queen",
    King: "king",
    Pawn: "pawn"
};

Object.freeze(PieceColor);
Object.freeze(PieceType);

class PossibleMoves {
    constructor(walkPositions = [], attackPositions = []) {
        this.walkPositions = walkPositions;
        this.attackPositions = attackPositions
    }
}

class ChessPiece {
    constructor(pieceColor, parentNode) {
        this.pieceColor = pieceColor
        this.parentNode = parentNode;
    }

    moveTo(newPosition, pieceObj) {
        const pieceImg = this.parentNode.firstChild;

        /*Remove a peça da posição atual*/
        this.parentNode.removeChild(pieceImg);

        /*Move a peça para a nova posição*/
        this.parentNode = document.querySelector(`#square${newPosition}`);
        this.parentNode.appendChild(pieceImg);

        /*Passando a nova posição da peça para o boardMap*/
        boardMap.set(newPosition, pieceObj);
    }
}

class Pawn extends ChessPiece {
    constructor(pieceColor, parentNode, startPosition) {
        super(pieceColor, parentNode);
        this.startPosition = startPosition;
    }

    /*Função que calcula as possíveis jogadas de acordo com 
    a posição atual da peça*/
    getPossibleMoves(currentPosition) {
        const possibleMoves = new PossibleMoves();
        let currentPositionInCoord = BoardCoord.toCoord(currentPosition);

        /*Se o peão estiver na posição inicial, no seu próximo
        movimento, ele pode pular uma casa*/
        if (currentPosition == this.startPosition) {
            possibleMoves.walkPositions.push(
                currentPositionInCoord.goUp(1),
                currentPositionInCoord.goUp(2)
            );
        } else {
            
            /*Se o movimento pra cima for parar em um quadrado de id >= 1
            e se não houver peças naquele quadrado*/
            if (currentPositionInCoord.goUp(1) >= 1 
            && boardMap.get(currentPositionInCoord.goUp(1)) == null
            ) {
                possibleMoves.walkPositions.push(currentPositionInCoord.goUp(1));
            }
        }

        /*Calculando onde esta peça pode atacar de acordo com sua posição atual*/
        let leftDiagonal = parseInt(currentPositionInCoord.walk(-1, 1));
        let rightDiagonal = parseInt(currentPositionInCoord.walk(1, 1));
        let leftDiagonalPiece = boardMap.get(leftDiagonal);
        let rightDiagonalPiece = boardMap.get(rightDiagonal);

        let leftDiagonalCoord = BoardCoord.toCoord(leftDiagonal);
        let rightDiagonalCoord = BoardCoord.toCoord(rightDiagonal);

        let ignoreRightDiagonal = false;
        let ignoreLeftDiagonal = false;
        
        // Se as diagonais não estiverem no mesmo Y
        if (leftDiagonalCoord.y != rightDiagonalCoord.y) {
            /*Se a diagonal da direita estiver no mesmo Y da posição desta peça*/
            if (rightDiagonalCoord.y == currentPositionInCoord.y)
                /*Ignorar a verificação da diagonal direita*/
                ignoreRightDiagonal = true;
            
            if (leftDiagonalCoord.y == BoardCoord.toCoord(currentPositionInCoord.goUp(2)).y)
                /*Ignorar a verificação da diagonal esquerda*/
                ignoreLeftDiagonal = true;
        }

        /*Se houver peça na diagonal direita do peão e ela for inimiga*/
        if (!ignoreRightDiagonal
            && rightDiagonalPiece != null 
            && rightDiagonalPiece.pieceColor != playerColor
        ) {
            possibleMoves.attackPositions.push(rightDiagonal);
        }
        
        /*Se houver peça na diagonal esquerda do peão e ela for inimiga*/
        if (!ignoreLeftDiagonal
            && leftDiagonalPiece != null 
            && leftDiagonalPiece.pieceColor != playerColor
        ) {
            possibleMoves.attackPositions.push(leftDiagonal);
        }

        return possibleMoves;
    }
}

class Rook extends ChessPiece {
    constructor(pieceColor, parentNode) {
        super(pieceColor, parentNode);
    }

    /*Essa função calcula aonde essa peça pode andar de acordo com sua posição atual*/
    /*Obs: a função só leva em conta aonde a peça poderia andar, não verificando se há
    peças no caminho bloqueando o movimento*/
    whereCanWalk(currentPosition) {
        // TODO
    }
}

class Horse extends ChessPiece {
    constructor(pieceColor, parentNode) {
        super(pieceColor, parentNode);
    }

    /*Essa função calcula aonde essa peça pode andar de acordo com sua posição atual*/
    /*Obs: a função só leva em conta aonde a peça poderia andar, não verificando se há
    peças no caminho bloqueando o movimento*/
    whereCanWalk(currentPosition) {
        // TODO
    }
}

class Bishop extends ChessPiece {
    constructor(pieceColor, parentNode) {
        super(pieceColor, parentNode);
    }

    /*Essa função calcula aonde essa peça pode andar de acordo com sua posição atual*/
    /*Obs: a função só leva em conta aonde a peça poderia andar, não verificando se há
    peças no caminho bloqueando o movimento*/
    whereCanWalk(currentPosition) {
        // TODO
    }
}

class Queen extends ChessPiece {
    constructor(pieceColor, parentNode) {
        super(pieceColor, parentNode);
    }

    /*Essa função calcula aonde essa peça pode andar de acordo com sua posição atual*/
    /*Obs: a função só leva em conta aonde a peça poderia andar, não verificando se há
    peças no caminho bloqueando o movimento*/
    whereCanWalk(currentPosition) {
        // TODO
    }
}

class King extends ChessPiece {
    constructor(pieceColor, parentNode) {
        super(pieceColor, parentNode);
    }

    /*Essa função calcula aonde essa peça pode andar de acordo com sua posição atual*/
    /*Obs: a função só leva em conta aonde a peça poderia andar, não verificando se há
    peças no caminho bloqueando o movimento*/
    whereCanWalk(currentPosition) {
        // TODO
    }
}