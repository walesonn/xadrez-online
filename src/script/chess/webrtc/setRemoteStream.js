export function setRemoteStream(stream){
    let audio = document.getElementsByTagName("audio")[0]
    if(!audio){
        audio = document.createElement("audio");
    }
    audio.srcObject = stream;
    audio.autoplay = true;
    audio.volume = 1;
    const body = document.getElementsByTagName("body")[0];
    body.appendChild(audio);
}