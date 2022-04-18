class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /*Converte essa Coord para um número do tabuleiro
    Ex: {x: 8 y: 8} => 64*/
    toNumber() {
        return ((this.y - 1) * 8) + this.x;
    }

    walk(x, y) {
        let coord = new Coord(this.x + x, this.y - y);
        return coord.toNumber();
    }

    goUp(amount = 1) {
        if (this.y + amount > 1) { 
            let coord = new Coord(this.x, this.y - amount);
            return coord.toNumber();
        } else 
            console.warn("Valor mínimo de Y atingido.");
    }

    goDown(amount = 1) {
        if (this.y < 8) { 
            let coord = new Coord(this.x, this.y + amount);
            return coord.toNumber();
        } else 
            console.warn("Valor máximo de Y atingido.");
    }

    goRight(amount = 1) {
        if (this.x < 8) { 
            let coord = new Coord(this.x + amount, this.y);
            return coord.toNumber();
        } else 
            console.warn("Valor máximo de X atingido.");
    }

    goLeft(amount = 1) {
        if (this.x > 1) { 
            let coord = new Coord(this.x - amount, this.y);
            return coord.toNumber();
        } else 
            console.warn("Valor mínimo de X atingido.");
    }
}

class BoardCoord {

    /*
    O "x" representa a coluna e o "y" a linha do quadrado
    começando pelo topo (ou seja, "y" é maior conforme desce)
    */
    static toCoord(num) {
        if (num < 1 || num > 64) 
            throw new Error(num + " não é um número válido! Precisa estar entre 1 e 64");

        const MIN = 1;
        const MAX = 8;

        let x = num % MAX;
        let y = Math.ceil(Math.min(Math.max(num / 8, MIN), MAX));
        
        if (x === 0) x = MAX;
        
        return new Coord(x, y);
    }
}