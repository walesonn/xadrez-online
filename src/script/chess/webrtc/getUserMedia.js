export function getUserMedia(){
    return navigator.mediaDevices.getUserMedia({audio: true, video: false}) 
}