import { useEffect, useState } from "react";
import useWebRtcStats from "./WebrtcStats";
const onIceCandidate = (type, event, ws, otherPeerid) => {
    return;
    ws.send(JSON.stringify({
        type: "candidate",
        name: otherPeerid,
        payload: {
            video: type === "video" ? event.candidate : undefined,
            audio: type === "audio" ? event.candidate : undefined
        }
    }));
}

const useSignaling = (otherPeerid) => {
    const [videoPeerConnectionState, setVideoPeerConnectionState] = useState({});
    const [audioPeerConnectionState, setAudioPeerConnectionState] = useState({});
    useEffect(() => {
        const iceConfiguration = {
            'iceServers': [
                { 'urls': 'stun:stun.l.google.com:19302' }
            ]
        };
        const videoPeerConnection = new RTCPeerConnection(iceConfiguration);
        const audioPeerConnection = new RTCPeerConnection(iceConfiguration);
        videoPeerConnection.addTransceiver("video", { direction: "recvonly" });
        audioPeerConnection.addTransceiver("audio", { direction: "recvonly" });
        const ws = new WebSocket(`wss://signaling.darkube.app/ws`);

        videoPeerConnection.addEventListener('icecandidate', e => onIceCandidate("video", e, ws, otherPeerid));
        audioPeerConnection.addEventListener('icecandidate', e => onIceCandidate("audio", e, ws, otherPeerid));

        setAudioPeerConnectionState(audioPeerConnection);
        setVideoPeerConnectionState(videoPeerConnection);

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "login" }));
        };
        ws.onmessage = (msg) => {
            try {
                let { type, payload } = JSON.parse(msg.data);
                if (type) {
                    switch (type) {
                        case "login":
                            if (payload.success) {
                                videoPeerConnection.createOffer()
                                    .then((offer) => videoPeerConnection.setLocalDescription(offer))
                                    .then(() => {
                                        audioPeerConnection.createOffer()
                                            .then((offer) => audioPeerConnection.setLocalDescription(offer))
                                            .then(() => {
                                                ws.send(JSON.stringify({
                                                    type: "offer",
                                                    payload: {
                                                        name: otherPeerid,
                                                        offer: {
                                                            video: videoPeerConnection.localDescription,
                                                            audio: audioPeerConnection.localDescription,
                                                        }
                                                    }
                                                }))
                                            });
                                    });
                            } else {
                                ws.send(JSON.stringify({ type: "login" }));
                            }
                            break;
                        case "offer":
                            var { video, audio } = payload.offer;
                            console.log(video, audio);
                            if (video && audio) {
                                videoPeerConnection.setRemoteDescription(video)
                                    .then(() => {
                                        videoPeerConnection.createAnswer()
                                            .then((answer) => videoPeerConnection.setLocalDescription(answer))
                                            .then(() => {
                                                audioPeerConnection.setRemoteDescription(audio)
                                                    .then(() => {
                                                        audioPeerConnection.createAnswer()
                                                            .then((answer) => audioPeerConnection.setLocalDescription(answer))
                                                            .then(() => {
                                                                ws.send(JSON.stringify({
                                                                    type: "answer",
                                                                    payload: {
                                                                        name: otherPeerid,
                                                                        answer: {
                                                                            video: videoPeerConnection.localDescription,
                                                                            audio: audioPeerConnection.localDescription,
                                                                        }
                                                                    }
                                                                }))
                                                            })
                                                    });
                                            })
                                    });
                            }
                            break;
                        case "answer":
                            let video1 = payload.answer.video;
                            let audio1 = payload.answer.audio;
                            if (video1) {
                                videoPeerConnection.setRemoteDescription(video1);
                            }
                            if (audio1) {
                                audioPeerConnection.setRemoteDescription(audio1);
                            }
                            break;
                        case "candidate":
                            let video2 = payload.answer.video;
                            let audio2 = payload.answer.audio;
                            if (video2) {
                                videoPeerConnection.addIceCandidate(video2);
                            }
                            if (audio2) {
                                audioPeerConnection.addIceCandidate(audio2);
                            }
                            break;
                        case "leave":
                            break;
                        default:
                            break
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        console.log('useEffect inside useSignailng');
        const closeWebsocket = () => {
            ws.onmessage = undefined;
            if (ws.readyState === 1) {
                ws.close();
            } else {
                setTimeout(() => closeWebsocket(), 100);
            }
        }
        return () => {
            console.log('useEffect inside useSignailng unmount');
            closeWebsocket();
            videoPeerConnection.close();
            audioPeerConnection.close();
        }
    }, [otherPeerid]);

    return {
        videoPeerConnection: videoPeerConnectionState,
        audioPeerConnection: audioPeerConnectionState,
        stats: useWebRtcStats(videoPeerConnectionState)
    }
}

export default useSignaling;