import { checkAudioMediaDevice } from "./checkAudioMediaDevice.js";
import { configuration, mediaConfiguration } from "./configuration.js";
import { getUserMedia } from "./getUserMedia.js";
import { setRemoteStream } from "./setRemoteStream.js";

export default async function createAnswer(socket, offer, to){
    try {

        const devices = await checkAudioMediaDevice()
        
        if(devices && !devices.length){
            throw new Error('Audio device not found!')
        }

        const localStream = await getUserMedia(mediaConfiguration);
        const peerConnection = new RTCPeerConnection(configuration);
        localStream.getTracks().forEach(track=>{
            peerConnection.addTrack(track, localStream)
        })
        
        peerConnection.addEventListener("icecandidate",(event)=>{
            if(event.candidate){
                sendIce(socket,event.candidate, to)
            }
        })

        peerConnection.addEventListener('connectionstatechange', event => {
            if (peerConnection.connectionState === 'connected') {
                // Peers connected!
                console.log("Peer connected")
            }
        });

        peerConnection.addEventListener("track", (event)=>{
            const [remoteStream] = event.streams;
            setRemoteStream(remoteStream)
        })

        peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = peerConnection.createAnswer()
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
        socket.on("ice",(ice)=>{
            if(ice){
                peerConnection.addIceCandidate(ice);
            }
        })
        socket.emit("answer", answer, to);
        return answer;
    } catch (error) {
        throw error
    }
}