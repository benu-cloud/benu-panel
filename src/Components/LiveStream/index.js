import React from "react";
import { useEffect, useRef } from "react";
import KeyboardInput from "../UserInputs/Keyboard";
import MouseInput from "../UserInputs/Mouse";
import './index.css';

function onIceCandidate(type, event, ws, otherPeerid) {
    ws.send(JSON.stringify({
        type: "candidate",
        name: otherPeerid,
        payload: {
            video: type === "video" ? event.candidate : undefined,
            audio: type === "audio" ? event.candidate : undefined
        }
    }));
}

const LiveStream = ({ peerid, otherPeerid }) => {
    const videoPLayer = useRef(null);
    let caller;
    const startcall = () => {
        const videoPeerConnection = new RTCPeerConnection();
        const audioPeerConnection = new RTCPeerConnection();

        videoPeerConnection.addEventListener('icecandidate', e => onIceCandidate("video", e, ws, otherPeerid));
        audioPeerConnection.addEventListener('icecandidate', e => onIceCandidate("audio", e, ws, otherPeerid));

        const ws = new WebSocket(`ws://localhost:8080/ws`);
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
                            if (peerid === "javad") {
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
                            }
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
    }

    return (
        <>
            <button onClick={startcall}>start call</button>
            <video
                ref={videoPLayer}
                autoPlay
                controls
                preload="none"
                className="remote-stream-player"
            />
            <KeyboardInput />
            <MouseInput />
        </>
    );
}

export default LiveStream;