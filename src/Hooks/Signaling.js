import { useEffect, useState } from "react";

const onIceCandidate = (type, event, ws, otherPeerid) => {
    ws.send(JSON.stringify({
        type: "candidate",
        name: otherPeerid,
        payload: {
            video: type === "video" ? event.candidate : undefined,
            audio: type === "audio" ? event.candidate : undefined
        }
    }));
}

const useSignaling = (peerid, otherPeerid) => {
    const [videoPeerConnectionState, setVideoPeerConnectionState] = useState({});
    const [audioPeerConnectionState, setAudioPeerConnectionState] = useState({});
    useEffect(() => {
        const videoPeerConnection = new RTCPeerConnection();
        const audioPeerConnection = new RTCPeerConnection();

        const ws = new WebSocket(`wss://signaling.darkube.app/ws`);
        let caller;

        videoPeerConnection.addEventListener('icecandidate', e => onIceCandidate("video", e, ws, otherPeerid));
        audioPeerConnection.addEventListener('icecandidate', e => onIceCandidate("audio", e, ws, otherPeerid));

        setAudioPeerConnectionState(audioPeerConnection);
        setVideoPeerConnectionState(videoPeerConnection);

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "login",
                payload: {
                    name: peerid
                }
            }));
        };
        ws.onmessage = (msg) => {
            try {
                let { type, payload } = JSON.parse(msg.data);
                if (type) {
                    switch (type) {
                        case "login":
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
                            break;
                        case "offer":
                            caller = payload.name;
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
                            if (video1 && audio1) {
                                videoPeerConnection.setRemoteDescription(video1);
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
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        console.log('useEffect inside useSignailng');
        const closeWebsocket = () => {
            if (ws.readyState === 1) {
                ws.close();
            } else {
                setTimeout(() => closeWebsocket(), 100);
            }
        }
        return () => {
            console.log('useEffect inside useSignailng unmount');
            closeWebsocket();
            // ws.close();
            videoPeerConnection.close();
            audioPeerConnection.close();
        }
    }, [peerid, otherPeerid]);

    return {
        videoPeerConnection: videoPeerConnectionState,
        audioPeerConnection: audioPeerConnectionState
    }
}

export default useSignaling;