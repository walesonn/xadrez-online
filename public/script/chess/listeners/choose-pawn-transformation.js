import { PieceType, Queen, Rook, Horse, Bishop } from "../pieceClasses.js";
import { BoardCoord, Coord } from "../utils/boardCoord.js";

export default function addChoosePawnTransformationListener(game) {
    const choosePawnTransformation = document.querySelector('#choose-pawn-transformation');

    choosePawnTransformation.addEventListener('mousedown', e => {
        const pawnToTransform = game.pawnToTransform;
        const choiceClassList = e.target.classList;

        let newPieceType = null;
        let newPieceObject = null;

        if (choiceClassList.contains(PieceType.Queen)) {
            newPieceType = PieceType.Queen;
            newPieceObject = new Queen(
                game, 
                pawnToTransform.pieceColor, 
                pawnToTransform.position)
        } else if (choiceClassList.contains(PieceType.Rook)) {
            newPieceType = PieceType.Rook;
            newPieceObject = new Rook(
                game, 
                pawnToTransform.pieceColor, 
                pawnToTransform.position)
        } else if (choiceClassList.contains(PieceType.Horse)) {
            newPieceType = PieceType.Horse;
            newPieceObject = new Horse(
                game, 
                pawnToTransform.pieceColor, 
                pawnToTransform.position)
        } else if (choiceClassList.contains(PieceType.Bishop)) {
            newPieceType = PieceType.Bishop;
            newPieceObject = new Bishop(
                game, 
                pawnToTransform.pieceColor, 
                pawnToTransform.position)
        }

        if (!newPieceObject || !newPieceType) return;

        game.state.boardMap.set(
            pawnToTransform.position, 
            newPieceObject
        );

        document.querySelector(`#square${pawnToTransform.position}`)
            .firstChild
            .classList
            .replace(PieceType.Pawn, newPieceType);

        const pawnToTransformCoord = BoardCoord
            .toCoord(pawnToTransform.position);
        const pawnToTransformMirrored = BoardCoord
            .mirrorPosition(pawnToTransformCoord).toNumber();

        const command = {
            type: 'pawnTransformed',
            pawnPosition: pawnToTransformMirrored,
            pieceColor: pawnToTransform.pieceColor,
            transformType: newPieceType,
            roomId: game.state.roomId
        }

        choosePawnTransformation.style.display = 'none';
        game.notifyAll(command);
        game.pawnToTransform = null;
    });
}