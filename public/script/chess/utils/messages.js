export const MessageType = Object.freeze({ 
    SendLink: 0,
    InCheck: 1,
    Winner: 2,
    RoomClosed: 3,
    PlayerDisconnected: 4
});

export function getMessage(messageType, ...replacements) {
    switch (messageType) {
        case MessageType.SendLink:
            return `<strong>Bem-vindo!</strong><br>Clique no botão abaixo para copiar o link da sala e o envie para quem você quiser jogar contra.`
        case MessageType.InCheck:
            return '<strong>Atenção:</strong><br>A jogada feita pelo oponente deixou o seu rei em xeque!';
        case MessageType.Winner:
            return `As peças ${replacements[0]} ganharam o jogo!`;
        case MessageType.RoomClosed:
            return '<strong>Jogo encerrado:</strong><br>Essa sala está fechada! Por favor, crie outra para poder jogar.'
        case MessageType.PlayerDisconnected:
            return '<strong>Jogo encerrado:</strong><br>Ops! Um dos jogadores teve a conexão perdida, por favor, crie outra sala.';
    }
}