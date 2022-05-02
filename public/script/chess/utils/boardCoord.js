class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /* Converte essa Coord para um número do tabuleiro
    Ex: { x: 8, y: 8 } => 64 */
    toNumber = () => ((this.y - 1) * 8) + this.x;

    go(x, y) {
        let coord = new Coord(this.x + x, this.y - y);
        return coord;
    }

    goUp(amount = 1) {
        let coord = new Coord(this.x, this.y - amount);
        return coord;
    }

    goDown(amount = 1) {
        let coord = new Coord(this.x, this.y + amount);
        return coord;
    }

    goRight(amount = 1) {
        let coord = new Coord(this.x + amount, this.y);
        return coord;
    }

    goLeft(amount = 1) {
        let coord = new Coord(this.x - amount, this.y);
        return coord;
    }
}

class BoardCoord {
    /* O "x" representa a coluna e o "y" a linha do quadrado
    começando pelo topo (ou seja, "y" é maior conforme desce) */
    static toCoord(num) {
        if (num < 0 || num > 64) 
            throw new Error(num + " não é um número válido! Precisa estar entre 1 e 64");

        const MIN = 1;
        const MAX = 8;

        let x = num % MAX;

        /* Usando o Math.ceil para arredondar o valor para cima
        o Math.min para o valor mínimo do cálculo ser 1
        e o Math.max para o valor máximo do cálculo ser 8 */
        let y = Math.ceil(Math.min(Math.max(num / 8, MIN), MAX));
        
        if (x === 0) x = MAX;
        
        return new Coord(x, y);
    }

    /* Espelha uma única posição do tabuleiro */
    static mirrorPosition(coord) {
        return new Coord(coord.x, (8 - coord.y) + 1);
    }

    /* Espelha o movimento no tabuleiro */
    static mirrorPlay(oldPositionCoord, newPositionCoord) {
        const mirroredOldPosition = this.mirrorPosition(oldPositionCoord);
        
        const yOffset = (oldPositionCoord.y - newPositionCoord.y);
        
        const mirroredNewPosition = new Coord(
            newPositionCoord.x, 
            mirroredOldPosition.y + yOffset
        );

        return { 
            oldPosition: mirroredOldPosition.toNumber(), 
            newPosition: mirroredNewPosition.toNumber()
        }
    }
}

export { 
    Coord, 
    BoardCoord 
}