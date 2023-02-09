import React from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import KeyboardInput from "../UserInputs/Keyboard";
import MouseInput from "../UserInputs/Mouse";
import useSignaling from "../../Hooks/Signaling";
import './index.css';
import poster from "../../Assets/benu-logo-type-black.png";

const LiveStream = ({ otherPeerid, loading, setLoading }) => {
    const videoPLayer = useRef(null);
    let navigate = useNavigate();

    const { videoPeerConnection, audioPeerConnection, datachannel, exit } = useSignaling(otherPeerid);

    const sentToDataChannel = (msg) => {
        datachannel.readyState === "open" && datachannel.send(msg);
    }
    
    useEffect(() => {
        if (exit.status) {
            setLoading(false);
            navigate('/');
            message.error(exit.msg, 5);
        }
    }, [exit, navigate, setLoading]);
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
        console.log("datachannel", datachannel);
        datachannel.onopen = (event) => {
            datachannel.send('Hi you!');
        }
    }, [videoPeerConnection, audioPeerConnection, datachannel, setLoading])

    return (
        <>
            <video
                ref={videoPLayer}
                autoPlay
                controls=""
                preload="none"
                className="remote-stream-player"
                poster={poster}
                style={{ display: loading ? 'none' : 'block' }}
            >
            </video>
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