const body = document.getElementsByTagName("body")[0];
const boardMap = new Map();

const board = document.querySelector("#board");
let isBoardRotated; /*boolean*/

const playerColor = PieceColor.Dark;

/*Variáveis usadas na função createRules()*/
let selectedPiece = null;
let firstSelection = false;
let selectedPiecePosition; /*int*/
let pieceObj; /*ChessPiece*/
let whereCanWalk; /*array*/

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
        let parentNode = document.querySelector(`#square${i}`);
        let pieceImg = document.createElement("img");
        let classesToAdd = [];

        pieceImg.classList.add("chess-piece");
        
        /*Peças brancas*/
        if (i == 1 || i == 8) classesToAdd = [PieceColor.White, PieceType.Rook];
        else if (i == 2 || i == 7) classesToAdd = [PieceColor.White, PieceType.Horse];
        else if (i == 3 || i == 6) classesToAdd = [PieceColor.White, PieceType.Bishop];
        else if (i == 4) classesToAdd = [PieceColor.White, PieceType.Queen];
        else if (i == 5) classesToAdd = [PieceColor.White, PieceType.King];
        else if (i >= 9 && i <= 16) classesToAdd = [PieceColor.White, PieceType.Pawn];

        /*Peças pretas*/
        else if (i >= 49 && i <= 56) classesToAdd = [PieceColor.Dark, PieceType.Pawn];
        else if (i == 57 || i == 64) classesToAdd = [PieceColor.Dark, PieceType.Rook];
        else if (i == 58 || i == 63) classesToAdd = [PieceColor.Dark, PieceType.Horse];
        else if (i == 59 || i == 62) classesToAdd = [PieceColor.Dark, PieceType.Bishop];
        else if (i == 60) classesToAdd = [PieceColor.Dark, PieceType.Queen];
        else if (i == 61) classesToAdd = [PieceColor.Dark, PieceType.King];

        if (classesToAdd.length > 0) {
            classesToAdd.forEach(e => {
                pieceImg.classList.add(e);
            });

            /*Adicionando a imagem da peça como filha da div que representa o quadrado*/
            parentNode.appendChild(pieceImg);
        }
    }
}

/*Preenche o Map que contém os conjuntos de chave e valor que representam
o tabuleiro, contendo [posição, objeto], onde a posição é o id de um quadrado
do tabuleiro e o objeto é uma classe ChessPiece ou null*/
function fillBoardMap() {
    for (let i = 1; i <= 64; i++) {
        let parentNode = document.querySelector(`#square${i}`);
        let child = document.querySelector(`#square${i}`).firstChild;

        /*Se o quadrado da iteração atual conter um child*/
        if (child) {
            let pieceColor = child.classList.contains(PieceColor.White)
                ? PieceColor.White
                : PieceColor.Dark;

            if (child.classList.contains(PieceType.Rook))
                boardMap.set(i, new Rook(pieceColor, parentNode));
            else if (child.classList.contains(PieceType.Horse))
                boardMap.set(i, new Horse(pieceColor, parentNode));
            else if (child.classList.contains(PieceType.Bishop))
                boardMap.set(i, new Bishop(pieceColor, parentNode));
            else if (child.classList.contains(PieceType.Queen))
                boardMap.set(i, new Queen(pieceColor, parentNode));
            else if (child.classList.contains(PieceType.King))
                boardMap.set(i, new King(pieceColor, parentNode));
            else if (child.classList.contains(PieceType.Pawn))
                boardMap.set(i, new Pawn(pieceColor, parentNode, i));
        } else {
            /*Caso não tenha uma peça (child) no quadrado de índice 
            atual, seu valor é passado pro Map como nulo*/
            boardMap.set(i, null);
        }
    }
}

function createRules() {
    let squares = [...document.querySelectorAll("#board .square")];
    
    squares.forEach(square => {
        square.addEventListener("mousedown", function(event) {
            /*Se o jogador clicou em outro quadrado já estando com uma
            peça selecionada, deseleciona-la*/
            if (this.firstChild && selectedPiece) {
                selectedPiece = null;
                unpaintSquares(whereCanWalk);
            }

            /*Se o jogador clicou em outro quadrado já estando com uma peça
            selecionada, essa não é a primeira seleção dele*/
            if (selectedPiece) firstSelection = false;

            /*Quando o jogador selecionar uma casa que contenha uma peça*/
            /*&& Se não houver peça selecionada*/
            /*&& Se a peça selecionada for uma peça do player (mesma cor)*/
            if (this.firstChild 
                && selectedPiece === null
                && this.firstChild.classList.contains(playerColor)
            ) {
                firstSelectionCall(this);
            }

            /*Se o jogador estiver com uma peça selecionada*/
            if (selectedPiece && !firstSelection) {
                secondSelectionCall(event.target);
            }
        });
    });
}

function rotateBoard() {
    isBoardRotated = board.classList.toggle("rotated");
    
    [...document.querySelectorAll(".chess-piece")].forEach(piece => {
        piece.classList.toggle("rotated");
    });

    /*Mudando o id das divs para que a 1 div superior esquerda 
    seja sempre a #square1*/
    let offset = 57; let column = 0;
    for (let i = 1; i <= 64; i++) {
        let newId = "square" + i;
        document.querySelector(`#square${offset + column}`).id = newId;

        column += 1;

        if (column == 8) {
            offset -= 8;
            column = 0;
        }
    }
}

function setup() {
    /*Por padrão, o tabuleiro está com o lado preto virado para a pessoa
    Portanto, se o jogador for o das peças brancas, rotacionar o tabuleiro*/
    if (playerColor === PieceColor.White) rotateBoard();
    else isBoardRotated = false;

    /*Importante: é preciso rotacionar o tabuleiro para o lado correto antes
    de chamar a função "fillBoardMap", pois ela usa a posição dos quadrados
    como referência para preencher o Map, sendo o quadrado do topo esquerdo
    o primeiro elemento*/
    fillBoardMap();

    /*Adiciona listeners para as peças*/
    addListeners();
}

function run() {
    /*Cria e exibe o tabuleiro de xadrez na página*/
    createBoard();

    /*Coloca todas as peças no tabuleiro*/
    putPieces();

    /*Cria toda a regra do jogo*/
    createRules();

    /*Seta configurações iniciais*/
    setup();
}

run();