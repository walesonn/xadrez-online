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

    /*Essa função calcula aonde essa peça pode andar de acordo com sua posição atual*/
    /*Obs: a função só leva em conta aonde a peça poderia andar, não verificando se há
    peças no caminho bloqueando o movimento*/
    whereCanWalk(currentPosition) {
        /*Se o peão estiver na posição inicial, no seu próximo
        movimento, ele pode pular uma casa*/
        if (currentPosition == this.startPosition) {
            return [currentPosition - 8, currentPosition - 16];
        } else {
            return (currentPosition - 8 <= 64 && currentPosition - 8 >= 0) 
                ? [currentPosition - 8] 
                : [];
        }

        /*
        peão pode se mover e comer uma peça quando:

        // olhando as diagonais do peão
        if ()
        */
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