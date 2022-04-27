export const MessageType = Object.freeze({ 
    SendLink: 0,
    InCheck: 1,
    Winner: 2
});

export function getMessage(messageType, ...replacements) {
    let messageToReturn;

    switch (messageType) {
        case MessageType.SendLink:
            messageToReturn = `<strong>Bem-vindo!</strong><br>Clique no botão abaixo para copiar o link da sala e o envie para quem você quiser jogar contra.`
            break;
        case MessageType.InCheck:
            messageToReturn = 'Você está em xeque! Só é possível mexer o rei.';
            break;
        case MessageType.Winner:
            messageToReturn = `As peças ${replacements[0]} ganharam o jogo!`;
            break;
    }

    return messageToReturn;
}