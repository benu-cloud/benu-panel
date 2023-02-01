import React from "react";
import { useEffect, useRef } from "react";
import KeyboardInput from "../UserInputs/Keyboard";
import MouseInput from "../UserInputs/Mouse";
import useSignaling from "../../Hooks/Signaling";
import './index.css';

const LiveStream = ({ otherPeerid, loading, setLoading }) => {
    const videoPLayer = useRef(null);
    const datachannel = useRef(null);
    console.log('main');

    const { videoPeerConnection, audioPeerConnection } = useSignaling(otherPeerid);
    const sentToDataChannel = (msg) => {
        datachannel.current && datachannel.current.send(msg)
    }
    useEffect(() => {
        console.log('useEffect inside main');
        const stream = new MediaStream();

        videoPLayer.current.srcObject = stream;
        videoPeerConnection.ontrack = (event) => {
            stream.addTrack(event.track);
            setLoading(false);
        };
        audioPeerConnection.ontrack = (event) => {
            stream.addTrack(event.track);
        };
        audioPeerConnection.ondatachannel = (obj) => {
            datachannel.current = obj.channel;
        }
        setTimeout(() => setLoading(false), 3000);
    }, [videoPeerConnection, audioPeerConnection, setLoading])

    return (
        <>
            <video
                ref={videoPLayer}
                autoPlay
                preload="none"
                className="remote-stream-player"
                style={{ display: loading ? 'none' : 'block' }}
            />
            {
                loading
                    ? null
                    : <>
                        <KeyboardInput sendToServer={sentToDataChannel} />
                        <MouseInput sendToServer={sentToDataChannel} />
                    </>
            }
        </>
    );
}

export default LiveStream;