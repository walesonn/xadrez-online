import { PieceColor } from '../pieceClasses.js'

/* Cria e exibe o tabuleiro de xadrez na página */
export default function createBoard(playerColor) {

    const board = document.querySelector('#board');

    function render() {
        let child = board.lastElementChild;

        /* Limpa os elementos filhos (se houver) da div "board" */
        while (child) {
            board.removeChild(child);
            child = board.lastElementChild;
        }

        let column = 0;
        let black = (playerColor == PieceColor.White) ? false : true;
        
        /* Iterando 64 vezes (número de quadrados de um tabuleiro de xadrez) */
        for (let i = 1; i <= 64; i++) {
            const square = document.createElement("div");
            square.setAttribute("id", `square${i}`);
            
            /* Se a booleana "black" for verdade, o square ganha uma classe 
            chamada "black", caso contrário, chamada "white" */
            black
                ? square.classList.add("square", "black")
                : square.classList.add("square", "white");
            
            black = !black;
            column++;
            
            /*Adiciona o quadrado à div que representa o tabuleiro*/
            board.appendChild(square);
            
            /* Se for a oitava coluna, hora de "ir para outra linha", 
            invertendo a booleana "black" e setando a coluna para 0 */
            if (column === 8) {
                black = !black;
                column = 0;
            }
        }
    }

    function clear() {
        let child = board.lastElementChild;
        while (child) {
            board.removeChild(child);
            child = board.lastElementChild;
        }
    }

    return {
        render,
        clear
    }
}