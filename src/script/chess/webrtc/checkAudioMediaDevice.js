export async function checkAudioMediaDevice(){
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(item=> item.kind === 'audioinput')
}