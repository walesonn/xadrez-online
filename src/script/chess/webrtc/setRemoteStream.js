export default function setRemoteStream(stream){
    const audio = document.createElement("audio");
    audio.srcObject = stream;
    audio.autoplay = true;
    audio.volume = 1;
    const body = document.getElementsByTagName("body")[0];
    body.appendChild(audio);
}