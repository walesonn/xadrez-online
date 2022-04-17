const board = document.querySelector("#board");
let selectedPiece;

function createBoard() {
    let column = 0;
    let black = false;
    
    /*Iterando 64 vezes (número de quadrados de um tabuleiro de xadrez)*/
    for (let i = 1; i <= 64; i++) {
        const square = document.createElement("div");
        square.setAttribute("id", `square${i}`);
        
        /*Se a booleana "black" for verdade, o square ganha uma classe 
        chamada "black", caso contrário, chamada "white", em seguida, 
        a variável "black" tem seu valor invertido*/
        black 
            ? square.classList.add("square", "black")
            : square.classList.add("square", "white");
    
        black = !black;
        column++;
        
        /*Adiciona o quadrado à div que representa o tabuleiro*/
        board.appendChild(square);
        
        /*Se for a oitava coluna, hora de "ir para outra linha", 
        invertendo a booleana "black" e setando a coluna para 0 novamente*/
        if (column === 8) {
            black = !black;
            column = 0;
        }
    }
}

function putPieces() {
    for (let i = 1; i <= 64; i++) {
        let pieceImg = document.createElement("img");
        let classToAdd;
        
        /*Peças brancas*/
        if (i == 1 || i == 8) classToAdd = "white-rook";
        if (i == 2 || i == 7) classToAdd = "white-horse";
        if (i == 3 || i == 6) classToAdd = "white-bishop";
        if (i == 4) classToAdd = "white-queen";
        if (i == 5) classToAdd = "white-king";
        if (i >= 9 && i <= 16) classToAdd = "white-pawn";

        /*Peças pretas*/
        if (i >= 49 && i <= 56) classToAdd = "dark-pawn";
        if (i == 57 || i == 64) classToAdd = "dark-rook";
        if (i == 58 || i == 63) classToAdd = "dark-horse";
        if (i == 59 || i == 62) classToAdd = "dark-bishop";
        if (i == 60) classToAdd = "dark-queen";
        if (i == 61) classToAdd = "dark-king";

        if (classToAdd) pieceImg.classList.add(classToAdd);

        /*Se a img teve alguam classe adicionada à ela*/
        if (pieceImg.classList.length != 0) {
            /*Adicionando a imagem da peça como filha da div que representa o quadrado*/
            document.querySelector(`#square${i}`).appendChild(pieceImg);
        }
    }
}

function createRules() {
    let squares = [...document.querySelectorAll("#board .square")];
    squares.forEach(square => {
        square.addEventListener("click", function(event) {
            /*Se o quadrado conter um filho, há uma peça nele*/
            if (this.firstChild) 
                selectedPiece = this.firstChild;
            /*Se o jogador estiver com uma peça selecionada e clicar em um quadrado livre*/
            else if (!this.firstChild && selectedPiece) {
                /*Veja se ele pode mover aquela peça para o quadrado selecionado*/
                let positionClicked = parseInt(event.target.id.replace("square", ""));
                console.log(Pawn.whereCanWalkCalculation(positionClicked));

                // TODO
                // if (podeIr && nãoTemPeçaSuaNoCaminho)
            }
        });
    });
}

function rotateBoard() {
    board.classList.toggle("rotated");
}

/*Cria e exibe o tabuleiro de xadrez na página*/
createBoard();

/*Coloca todas as peças no tabuleiro*/
putPieces();

/*Cria toda a regra do jogo*/
createRules();