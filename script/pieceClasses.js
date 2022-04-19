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

    moveTo(newPosition) {
        let newPositionPiece = boardMap.get(newPosition);

        if (newPositionPiece != null)
            newPositionPiece.leaveBoard();

        const pieceImg = this.parentNode.firstChild;

        /*Remove a peça da posição atual*/
        this.parentNode.removeChild(pieceImg);

        let oldPosition = parseInt(
            this.parentNode.id.replace("square", "")
        );

        /*Move a peça para a nova posição*/
        this.parentNode = document.querySelector(`#square${newPosition}`);
        this.parentNode.appendChild(pieceImg);

        /*Setando o valor da posição antiga como nula (sem peça)*/
        boardMap.set(oldPosition, null);

        /*Passando a nova posição da peça para o boardMap*/
        boardMap.set(newPosition, this);
    }

    leaveBoard() {
        const pieceImg = this.parentNode.firstChild;

        /*Remove a peça da posição atual*/
        this.parentNode.removeChild(pieceImg);

        let position = parseInt(
            this.parentNode.id.replace("square", "")
        );

        /*Setando o valor da posição antiga como nula (sem peça)*/
        boardMap.set(position, null);
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

        let oneUpNumber = currentPositionInCoord.goUp(1).toNumber();
        let twoUpNumber = currentPositionInCoord.goUp(2).toNumber();
        
        let oneSquareUp = boardMap.get(oneUpNumber);
        let twoSquaresUp = boardMap.get(twoUpNumber);

        /*Se o peão estiver na posição inicial, no seu próximo
        movimento, ele pode pular uma casa, caso não haja obstáculos*/
        if (currentPosition == this.startPosition) {
            /*Se o quadrado de cima estiver livre*/
            if (oneSquareUp == null)
                possibleMoves.walkPositions.push(oneUpNumber);
            
            /*Se os dois quadrados acima estiverem livres*/
            if (oneSquareUp == null && twoSquaresUp == null)
                possibleMoves.walkPositions.push(twoUpNumber);
        } else {
            /*Se o movimento pra cima não for sair do tabuleiro
            e se não houver peças naquele quadrado*/
            if (currentPositionInCoord.goUp(1).y >= 1 && oneSquareUp == null)
                possibleMoves.walkPositions.push(oneUpNumber);
        }

        /*Calculando onde esta peça pode atacar de acordo com sua posição atual*/
        let leftDiagonal = parseInt(currentPositionInCoord.go(-1, 1).toNumber());
        let rightDiagonal = parseInt(currentPositionInCoord.go(1, 1).toNumber());
        let leftDiagonalPiece = boardMap.get(leftDiagonal);
        let rightDiagonalPiece = boardMap.get(rightDiagonal);

        if (leftDiagonal < 0 || rightDiagonal < 0)
            return possibleMoves;

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
            
            if (leftDiagonalCoord.y == currentPositionInCoord.goUp(2).y)
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

    /*Função que calcula as possíveis jogadas de acordo com 
    a posição atual da peça*/
    getPossibleMoves(currentPosition) {
        const possibleMoves = new PossibleMoves();
        let currentPositionInCoord = BoardCoord.toCoord(currentPosition);
        let counter = 1;

        /*CIMA: Loop para ver a movimentação possível*/
        while (true) {
            /*Se Y for menor a 1, está fora do tabuleiro*/
            if (currentPositionInCoord.goUp(counter).y < 1)
                break;
            
            let oneUpPosition = currentPositionInCoord.goUp(counter).toNumber();
            let oneSquareUp = boardMap.get(oneUpPosition);

            /*Se o quadrado de cima estiver vazio*/
            if (oneSquareUp == null) {
                possibleMoves.walkPositions.push(oneUpPosition);
            /*Se o quadrado de cima for uma peça inimiga*/
            } else if (oneSquareUp.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(oneUpPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado de cima for uma peça aliada*/
            } else if (oneSquareUp.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*BAIXO: Loop para ver a movimentação possível*/
        while (true) {
            /*Se Y for maior que 8, está fora do tabuleiro*/
            if (currentPositionInCoord.goDown(counter).y > 8)
                break;

            let oneDownPosition = currentPositionInCoord.goDown(counter).toNumber();
            let oneSquareDown = boardMap.get(oneDownPosition);

            /*Se o quadrado de baixo estiver vazio*/
            if (oneSquareDown == null) {
                possibleMoves.walkPositions.push(oneDownPosition);
            /*Se o quadrado de baixo for uma peça inimiga*/
            } else if (oneSquareDown.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(oneDownPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado de baixo for uma peça aliada*/
            } else if (oneSquareDown.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*ESQUERDA: Loop para ver a movimentação possível*/
        while (true) {
            /*Se X for menor que 1, está fora do tabuleiro*/
            if (currentPositionInCoord.goLeft(counter).x < 1)
                break;

            let oneLeftPosition = currentPositionInCoord.goLeft(counter).toNumber();
            let oneSquareLeft = boardMap.get(oneLeftPosition);

            /*Se o quadrado da esquerda estiver vazio*/
            if (oneSquareLeft == null) {
                possibleMoves.walkPositions.push(oneLeftPosition);
            /*Se o quadrado da esquerda for uma peça inimiga*/
            } else if (oneSquareLeft.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(oneLeftPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado da esquerda for uma peça aliada*/
            } else if (oneSquareLeft.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*DIREITA: Loop para ver a movimentação possível*/
        while (true) {
            /*Se X for maior que 8, está fora do tabuleiro*/
            if (currentPositionInCoord.goRight(counter).x > 8)
                break;

            let oneRightPosition = currentPositionInCoord.goRight(counter).toNumber();
            let oneSquareRight = boardMap.get(oneRightPosition);

            /*Se o quadrado da direita estiver vazio*/
            if (oneSquareRight == null) {
                possibleMoves.walkPositions.push(oneRightPosition);
            /*Se o quadrado da direita for uma peça inimiga*/
            } else if (oneSquareRight.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(oneRightPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado da direita for uma peça aliada*/
            } else if (oneSquareRight.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        return possibleMoves;
    }
}

class Horse extends ChessPiece {
    constructor(pieceColor, parentNode) {
        super(pieceColor, parentNode);
    }

    /*Função que calcula as possíveis jogadas de acordo com 
    a posição atual da peça*/
    getPossibleMoves(currentPosition) {
        const possibleMoves = new PossibleMoves();
        let currentPositionInCoord = BoardCoord.toCoord(currentPosition);

        /*Checando se a movimentação está dentro do tabuleiro*/
        /*2 pra cima e 1 pra direita*/
        if (currentPositionInCoord.go(1, 2).y >= 1 
            && currentPositionInCoord.go(1, 2).x <= 8
        ) {
            let targetPositionNumber = currentPositionInCoord.go(1, 2).toNumber();
            let targetSquare = boardMap.get(targetPositionNumber);

            /*Se o quadrado estiver livre*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPositionNumber);
            /*Se há uma peça inimiga no destino*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPositionNumber)
            }
        }

        /*Checando se a movimentação está dentro do tabuleiro*/
        /*2 pra cima e 1 pra esquerda*/
        if (currentPositionInCoord.go(-1, 2).y >= 1 
            && currentPositionInCoord.go(-1, 2).x >= 1
        ) {
            let targetPositionNumber = currentPositionInCoord.go(-1, 2).toNumber();
            let targetSquare = boardMap.get(targetPositionNumber);

            /*Se o quadrado estiver livre*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPositionNumber);
            /*Se há uma peça inimiga no destino*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPositionNumber)
            }
        }

        /*Checando se a movimentação está dentro do tabuleiro*/
        /*2 pra baixo e 1 pra direita*/
        if (currentPositionInCoord.go(1, -2).y <= 8
            && currentPositionInCoord.go(1, -2).x <= 8
        ) {
            let targetPositionNumber = currentPositionInCoord.go(1, -2).toNumber();
            let targetSquare = boardMap.get(targetPositionNumber);

            /*Se o quadrado estiver livre*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPositionNumber);
            /*Se há uma peça inimiga no destino*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPositionNumber)
            }
        }

        /*Checando se a movimentação está dentro do tabuleiro*/
        /*2 pra baixo e 1 pra esquerda*/
        if (currentPositionInCoord.go(-1, -2).y <= 8
            && currentPositionInCoord.go(-1, -2).x >= 1
        ) {
            let targetPositionNumber = currentPositionInCoord.go(-1, -2).toNumber();
            let targetSquare = boardMap.get(targetPositionNumber);

            /*Se o quadrado estiver livre*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPositionNumber);
            /*Se há uma peça inimiga no destino*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPositionNumber)
            }
        }

        /*Checando se a movimentação está dentro do tabuleiro*/
        /*2 pra esquerda e 1 pra cima*/
        if (currentPositionInCoord.go(-2, 1).y >= 1
            && currentPositionInCoord.go(-2, 1).x >= 1
        ) {
            let targetPositionNumber = currentPositionInCoord.go(-2, 1).toNumber();
            let targetSquare = boardMap.get(targetPositionNumber);

            /*Se o quadrado estiver livre*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPositionNumber);
            /*Se há uma peça inimiga no destino*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPositionNumber)
            }
        }

        /*Checando se a movimentação está dentro do tabuleiro*/
        /*2 pra direita e 1 pra cima*/
        if (currentPositionInCoord.go(2, 1).y >= 1
            && currentPositionInCoord.go(2, 1).x <= 8
        ) {
            let targetPositionNumber = currentPositionInCoord.go(2, 1).toNumber();
            let targetSquare = boardMap.get(targetPositionNumber);

            /*Se o quadrado estiver livre*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPositionNumber);
            /*Se há uma peça inimiga no destino*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPositionNumber)
            }
        }

        /*Checando se a movimentação está dentro do tabuleiro*/
        /*2 pra esquerda e 1 pra baixo*/
        if (currentPositionInCoord.go(-2, -1).y <= 8
            && currentPositionInCoord.go(-2, -1).x >= 1
        ) {
            let targetPositionNumber = currentPositionInCoord.go(-2, -1).toNumber();
            let targetSquare = boardMap.get(targetPositionNumber);

            /*Se o quadrado estiver livre*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPositionNumber);
            /*Se há uma peça inimiga no destino*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPositionNumber)
            }
        }

        /*Checando se a movimentação está dentro do tabuleiro*/
        /*2 pra direita e 1 pra baixo*/
        if (currentPositionInCoord.go(2, -1).y <= 8
            && currentPositionInCoord.go(2, -1).x <= 8
        ) {
            let targetPositionNumber = currentPositionInCoord.go(2, -1).toNumber();
            let targetSquare = boardMap.get(targetPositionNumber);

            /*Se o quadrado estiver livre*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPositionNumber);
            /*Se há uma peça inimiga no destino*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPositionNumber)
            }
        }
        
        return possibleMoves;
    }
}

class Bishop extends ChessPiece {
    constructor(pieceColor, parentNode) {
        super(pieceColor, parentNode);
    }

    /*Função que calcula as possíveis jogadas de acordo com 
    a posição atual da peça*/
    getPossibleMoves(currentPosition) {
        const possibleMoves = new PossibleMoves();
        let currentPositionInCoord = BoardCoord.toCoord(currentPosition);
        let counter = 1;

        /*DIAGONAL CIMA DIREITA: Loop para ver a movimentação possível*/
        while (true) {
            let move = currentPositionInCoord.go(counter, counter);

            /*Se o movimento não estiver dentro do limite do tabuleiro*/
            if (move.x > 8 || move.y < 1)
                break;
            
            let targetPosition = move.toNumber();
            let targetSquare = boardMap.get(targetPosition);

            /*Se o quadrado alvo estiver vazio*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPosition);
            /*Se o quadrado alvo for uma peça inimiga*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado alvo for uma peça aliada*/
            } else if (targetSquare.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*DIAGONAL CIMA ESQUERDA: Loop para ver a movimentação possível*/
        while (true) {
            let move = currentPositionInCoord.go(-counter, counter);

            /*Se o movimento não estiver dentro do limite do tabuleiro*/
            if (move.x < 1 || move.y < 1)
                break;
            
            let targetPosition = move.toNumber();
            let targetSquare = boardMap.get(targetPosition);

            /*Se o quadrado alvo estiver vazio*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPosition);
            /*Se o quadrado alvo for uma peça inimiga*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado alvo for uma peça aliada*/
            } else if (targetSquare.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*DIAGONAL BAIXO ESQUERDA: Loop para ver a movimentação possível*/
        while (true) {
            let move = currentPositionInCoord.go(-counter, -counter);

            /*Se o movimento não estiver dentro do limite do tabuleiro*/
            if (move.x < 1 || move.y > 8)
                break;
            
            let targetPosition = move.toNumber();
            let targetSquare = boardMap.get(targetPosition);

            /*Se o quadrado alvo estiver vazio*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPosition);
            /*Se o quadrado alvo for uma peça inimiga*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado alvo for uma peça aliada*/
            } else if (targetSquare.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*DIAGONAL BAIXO DIREITA: Loop para ver a movimentação possível*/
        while (true) {
            let move = currentPositionInCoord.go(counter, -counter);

            /*Se o movimento não estiver dentro do limite do tabuleiro*/
            if (move.x > 8 || move.y > 8)
                break;
            
            let targetPosition = move.toNumber();
            let targetSquare = boardMap.get(targetPosition);

            /*Se o quadrado alvo estiver vazio*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPosition);
            /*Se o quadrado alvo for uma peça inimiga*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado alvo for uma peça aliada*/
            } else if (targetSquare.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }
        
        return possibleMoves;
    }
}

class Queen extends ChessPiece {
    constructor(pieceColor, parentNode) {
        super(pieceColor, parentNode);
    }

    /*Função que calcula as possíveis jogadas de acordo com 
    a posição atual da peça*/
    getPossibleMoves(currentPosition) {
        const possibleMoves = new PossibleMoves();
        let currentPositionInCoord = BoardCoord.toCoord(currentPosition);
        let counter = 1;

        /*CIMA: Loop para ver a movimentação possível*/
        while (true) {
            /*Se Y for menor a 1, está fora do tabuleiro*/
            if (currentPositionInCoord.goUp(counter).y < 1)
                break;
            
            let oneUpPosition = currentPositionInCoord.goUp(counter).toNumber();
            let oneSquareUp = boardMap.get(oneUpPosition);

            /*Se o quadrado de cima estiver vazio*/
            if (oneSquareUp == null) {
                possibleMoves.walkPositions.push(oneUpPosition);
            /*Se o quadrado de cima for uma peça inimiga*/
            } else if (oneSquareUp.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(oneUpPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado de cima for uma peça aliada*/
            } else if (oneSquareUp.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*BAIXO: Loop para ver a movimentação possível*/
        while (true) {
            /*Se Y for maior que 8, está fora do tabuleiro*/
            if (currentPositionInCoord.goDown(counter).y > 8)
                break;

            let oneDownPosition = currentPositionInCoord.goDown(counter).toNumber();
            let oneSquareDown = boardMap.get(oneDownPosition);

            /*Se o quadrado de baixo estiver vazio*/
            if (oneSquareDown == null) {
                possibleMoves.walkPositions.push(oneDownPosition);
            /*Se o quadrado de baixo for uma peça inimiga*/
            } else if (oneSquareDown.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(oneDownPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado de baixo for uma peça aliada*/
            } else if (oneSquareDown.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*ESQUERDA: Loop para ver a movimentação possível*/
        while (true) {
            /*Se X for menor que 1, está fora do tabuleiro*/
            if (currentPositionInCoord.goLeft(counter).x < 1)
                break;

            let oneLeftPosition = currentPositionInCoord.goLeft(counter).toNumber();
            let oneSquareLeft = boardMap.get(oneLeftPosition);

            /*Se o quadrado da esquerda estiver vazio*/
            if (oneSquareLeft == null) {
                possibleMoves.walkPositions.push(oneLeftPosition);
            /*Se o quadrado da esquerda for uma peça inimiga*/
            } else if (oneSquareLeft.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(oneLeftPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado da esquerda for uma peça aliada*/
            } else if (oneSquareLeft.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*DIREITA: Loop para ver a movimentação possível*/
        while (true) {
            /*Se X for maior que 8, está fora do tabuleiro*/
            if (currentPositionInCoord.goRight(counter).x > 8)
                break;

            let oneRightPosition = currentPositionInCoord.goRight(counter).toNumber();
            let oneSquareRight = boardMap.get(oneRightPosition);

            /*Se o quadrado da direita estiver vazio*/
            if (oneSquareRight == null) {
                possibleMoves.walkPositions.push(oneRightPosition);
            /*Se o quadrado da direita for uma peça inimiga*/
            } else if (oneSquareRight.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(oneRightPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado da direita for uma peça aliada*/
            } else if (oneSquareRight.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*DIAGONAL CIMA DIREITA: Loop para ver a movimentação possível*/
        while (true) {
            let move = currentPositionInCoord.go(counter, counter);

            /*Se o movimento não estiver dentro do limite do tabuleiro*/
            if (move.x > 8 || move.y < 1)
                break;
            
            let targetPosition = move.toNumber();
            let targetSquare = boardMap.get(targetPosition);

            /*Se o quadrado alvo estiver vazio*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPosition);
            /*Se o quadrado alvo for uma peça inimiga*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado alvo for uma peça aliada*/
            } else if (targetSquare.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*DIAGONAL CIMA ESQUERDA: Loop para ver a movimentação possível*/
        while (true) {
            let move = currentPositionInCoord.go(-counter, counter);

            /*Se o movimento não estiver dentro do limite do tabuleiro*/
            if (move.x < 1 || move.y < 1)
                break;
            
            let targetPosition = move.toNumber();
            let targetSquare = boardMap.get(targetPosition);

            /*Se o quadrado alvo estiver vazio*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPosition);
            /*Se o quadrado alvo for uma peça inimiga*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado alvo for uma peça aliada*/
            } else if (targetSquare.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*DIAGONAL BAIXO ESQUERDA: Loop para ver a movimentação possível*/
        while (true) {
            let move = currentPositionInCoord.go(-counter, -counter);

            /*Se o movimento não estiver dentro do limite do tabuleiro*/
            if (move.x < 1 || move.y > 8)
                break;
            
            let targetPosition = move.toNumber();
            let targetSquare = boardMap.get(targetPosition);

            /*Se o quadrado alvo estiver vazio*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPosition);
            /*Se o quadrado alvo for uma peça inimiga*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado alvo for uma peça aliada*/
            } else if (targetSquare.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }

        counter = 1; /*Voltando para 1*/
        /*DIAGONAL BAIXO DIREITA: Loop para ver a movimentação possível*/
        while (true) {
            let move = currentPositionInCoord.go(counter, -counter);

            /*Se o movimento não estiver dentro do limite do tabuleiro*/
            if (move.x > 8 || move.y > 8)
                break;
            
            let targetPosition = move.toNumber();
            let targetSquare = boardMap.get(targetPosition);

            /*Se o quadrado alvo estiver vazio*/
            if (targetSquare == null) {
                possibleMoves.walkPositions.push(targetPosition);
            /*Se o quadrado alvo for uma peça inimiga*/
            } else if (targetSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(targetPosition);
                break; /*Parar o loop pois há uma peça no caminho*/
            /*Se o quadrado alvo for uma peça aliada*/
            } else if (targetSquare.pieceColor == playerColor) {
                break; /*Parar o loop pois há uma peça no caminho*/
            }

            counter++;
        }
        
        return possibleMoves;
    }
}

class King extends ChessPiece {
    constructor(pieceColor, parentNode) {
        super(pieceColor, parentNode);
    }

    /*Função que calcula as possíveis jogadas de acordo com 
    a posição atual da peça*/
    getPossibleMoves(currentPosition) {
        const possibleMoves = new PossibleMoves();
        let currentPositionInCoord = BoardCoord.toCoord(currentPosition);
        let move;

        move = currentPositionInCoord.goUp(1);
        let oneUpNumber = move.toNumber();
        let oneSquareUp = boardMap.get(oneUpNumber);
        
        if (move.y >= 1) {
            /*Se o quadrado estiver livre*/
            if (oneSquareUp == null) {
                possibleMoves.walkPositions.push(oneUpNumber);
            /*Se houver uma peça inimiga no quadrado*/
            } else if (oneSquareUp.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(oneUpNumber);
            }
        }

        let oneDownNumber = currentPositionInCoord.goDown(1).toNumber();
        let oneSquareDown = boardMap.get(oneDownNumber);
        
        if (currentPositionInCoord.goDown(1).y <= 8) {
            /*Se o quadrado estiver livre*/
            if (oneSquareDown == null) {
                possibleMoves.walkPositions.push(oneDownNumber);
            /*Se houver uma peça inimiga no quadrado*/
            } else if (oneSquareDown.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(oneDownNumber);
            }
        }

        move = currentPositionInCoord.goLeft(1);
        let oneLeftNumber = currentPositionInCoord.goLeft(1).toNumber();
        let oneSquareLeft = boardMap.get(oneLeftNumber);
        
        if (move.x >= 1) {
            /*Se o quadrado estiver livre*/
            if (oneSquareLeft == null) {
                possibleMoves.walkPositions.push(oneLeftNumber);
            /*Se houver uma peça inimiga no quadrado*/
            } else if (oneSquareLeft.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(oneLeftNumber);
            }
        }
        
        move = currentPositionInCoord.goRight(1);
        let oneRightNumber = currentPositionInCoord.goRight(1).toNumber();
        let oneSquareRight = boardMap.get(oneRightNumber);
        
        if (move.x <= 8) {
            /*Se o quadrado estiver livre*/
            if (oneSquareRight == null) {
                possibleMoves.walkPositions.push(oneRightNumber);
            /*Se houver uma peça inimiga no quadrado*/
            } else if (oneSquareRight.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(oneRightNumber);
            }
        }

        move = currentPositionInCoord.go(-1, 1)
        let leftUpDiagonalNumber = move.toNumber();
        let leftUpDiagonalSquare = boardMap.get(leftUpDiagonalNumber);
        
        if (move.x >= 1 && move.y >= 1) {
            /*Se o quadrado estiver livre*/
            if (leftUpDiagonalSquare == null) {
                possibleMoves.walkPositions.push(leftUpDiagonalNumber);
            /*Se houver uma peça inimiga no quadrado*/
            } else if (leftUpDiagonalSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(leftUpDiagonalNumber);
            }
        }

        move = currentPositionInCoord.go(1, 1);
        let rightUpDiagonalNumber = move.toNumber();
        let rightUpDiagonalSquare = boardMap.get(rightUpDiagonalNumber);
        
        if (move.x <= 8 && move.y >= 1) {
            /*Se o quadrado estiver livre*/
            if (rightUpDiagonalSquare == null) {
                possibleMoves.walkPositions.push(rightUpDiagonalNumber);
            /*Se houver uma peça inimiga no quadrado*/
            } else if (rightUpDiagonalSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(rightUpDiagonalNumber);
            }
        }

        move = currentPositionInCoord.go(-1, -1);
        let leftDownDiagonalNumber = move.toNumber();
        let leftDownDiagonalSquare = boardMap.get(leftDownDiagonalNumber);
        
        if (move.x >= 1 && move.y <= 8) {
            /*Se o quadrado estiver livre*/
            if (leftDownDiagonalSquare == null) {
                possibleMoves.walkPositions.push(leftDownDiagonalNumber);
            /*Se houver uma peça inimiga no quadrado*/
            } else if (leftDownDiagonalSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(leftDownDiagonalNumber);
            }
        }

        move = currentPositionInCoord.go(1, -1);
        let rightDownDiagonalNumber = move.toNumber();
        let rightDownDiagonalSquare = boardMap.get(rightDownDiagonalNumber);
        
        if (move.x <= 8 && move.y <= 8) {
            /*Se o quadrado estiver livre*/
            if (rightDownDiagonalSquare == null) {
                possibleMoves.walkPositions.push(rightDownDiagonalNumber);
            /*Se houver uma peça inimiga no quadrado*/
            } else if (rightDownDiagonalSquare.pieceColor != playerColor) {
                possibleMoves.attackPositions.push(rightDownDiagonalNumber);
            }
        }

        return possibleMoves;
    }
}