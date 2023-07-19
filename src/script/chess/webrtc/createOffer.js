import { checkAudioMediaDevice } from "./checkAudioMediaDevice.js";
import { configuration, mediaConfiguration } from "./configuration.js";
import { getUserMedia } from "./getUserMedia.js";
import { sendIce } from "./sendIce.js";
import { setRemoteStream } from "./setRemoteStream.js";

export default async function createOffer(socket, to){
    try {
        const devices = await checkAudioMediaDevice()
        
        if(devices && !devices.length){
            throw new Error('Audio device not found!')
        }

        const localStream = await getUserMedia(mediaConfiguration);
        const peerConnection = new RTCPeerConnection(configuration);
        localStream.getTracks().forEach(track=>{
            peerConnection.addTrack(track, localStream)
        });

        peerConnection.addEventListener("icecandidate",(event)=>{
            if(event.candidate){
                sendIce(socket, event.candidate, to)
            }
        });

        peerConnection.addEventListener('connectionstatechange', event => {
            if (peerConnection.connectionState === 'connected') {
                // Peers connected!
                console.log("Peer connected")
            }
        });

        peerConnection.addEventListener("track", (event)=>{
            const [remoteStream] = event.streams;
            console.log("[remote stream]")
            setRemoteStream(remoteStream)
        })

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.on("ice",(ice)=>{
            peerConnection.addIceCandidate(ice);
        })
        socket.emit("offer", offer, to);
        return offer;
    } catch (error) {
        throw error
    }
}