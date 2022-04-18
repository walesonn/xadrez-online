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

class ChessPiece {
    constructor(pieceColor, parentNode) {
        this.pieceColor = pieceColor
        this.parentNode = parentNode;
    }

    moveTo(newPosition) {
        const pieceImg = this.parentNode.firstChild;

        /*Remove a peça da posição atual*/
        this.parentNode.removeChild(pieceImg);

        /*Move a peça para a nova posição*/
        this.parentNode = document.querySelector(`#square${newPosition}`);
        this.parentNode.appendChild(pieceImg);
    }
}

class Pawn extends ChessPiece {
    constructor(pieceColor, parentNode, startPosition) {
        super(pieceColor, parentNode);
        this.startPosition = startPosition;
    }

    /*Função que calcula onde esta peça pode andar de acordo com sua posição atual*/
    whereCanWalk(currentPosition) {
        let currentPositionInCoord = BoardCoord.toCoord(currentPosition);

        /*Se o peão estiver na posição inicial, no seu próximo
        movimento, ele pode pular uma casa*/
        if (currentPosition == this.startPosition) {
            return [
                currentPositionInCoord.goUp(1),
                currentPositionInCoord.goUp(2)
            ];
        } else {
            /*Se o movimento pra cima for parar em um quadrado de id >= 1
            e se não houver peças naquele quadrado*/
            return (currentPositionInCoord.goUp(1) >= 1
                    && boardMap.get(currentPositionInCoord.goUp(1)) == null) 
                        ? [currentPositionInCoord.goUp(1)] 
                        : [];
        }
    }

    /*Função que calcula onde esta peça pode atacar de acordo com sua posição atual*/
    whereCanAttack(currentPosition) {
        let currentPositionInCoord = BoardCoord.toCoord(currentPosition);
        let canAttackPositions = [];

        let rightDiagonal = parseInt(currentPositionInCoord.walk(1, 1));
        let leftDiagonal = parseInt(currentPositionInCoord.walk(-1, 1));
        let rightDiagonalPiece = boardMap.get(rightDiagonal);
        let leftDiagonalPiece = boardMap.get(leftDiagonal);

        /*Se houver peça na diagonal direita do peão e ela for inimiga*/
        if (rightDiagonalPiece != null && rightDiagonalPiece.pieceColor != playerColor)
            canAttackPositions.push(rightDiagonal);
        
        /*Se houver peça na diagonal esquerda do peão e ela for inimiga*/
        if (leftDiagonalPiece != null && leftDiagonalPiece.pieceColor != playerColor)
            canAttackPositions.push(leftDiagonal);

        return canAttackPositions;
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