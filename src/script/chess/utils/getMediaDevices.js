
async function getAudioMediaDevice() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputDevices = devices.filter(item=> item.kind === 'audioinput')

    if(!audioInputDevices || !audioInputDevices.length){
        throw new Error('Seu navegador não possui dispositivos de captura de audio conectado')
    }

    return await navigator.mediaDevices.getUserMedia({audio: true, video: false})
}