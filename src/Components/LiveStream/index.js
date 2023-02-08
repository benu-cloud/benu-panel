import React from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import KeyboardInput from "../UserInputs/Keyboard";
import MouseInput from "../UserInputs/Mouse";
import useSignaling from "../../Hooks/Signaling";
import './index.css';
import poster from "../../Assets/benu-logo-type-black.png";

const LiveStream = ({ otherPeerid, loading, setLoading }) => {
    const videoPLayer = useRef(null);
    const datachannel = useRef(null);
    let navigate = useNavigate();
    console.log('main');

    const { videoPeerConnection, audioPeerConnection, exit } = useSignaling(otherPeerid);
    const sentToDataChannel = (msg) => {
        datachannel.current && datachannel.current.send(msg)
    }
    useEffect(()=>{
        if(exit){
            navigate('/');
        }
    }, [exit, navigate]);
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
    }, [videoPeerConnection, audioPeerConnection, setLoading])

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