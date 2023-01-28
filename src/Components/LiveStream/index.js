import React, { startTransition, useState } from "react";
import { useEffect, useRef } from "react";
import KeyboardInput from "../UserInputs/Keyboard";
import MouseInput from "../UserInputs/Mouse";
import useSignaling from "../../Hooks/Signaling";
import './index.css';
import staticMethods from "antd/es/message";

const LiveStream = ({ peerid, otherPeerid }) => {
    const videoPLayer = useRef(null);
    console.log('main');

    const { videoPeerConnection, audioPeerConnection } = useSignaling(peerid, otherPeerid);
    useEffect(() => {
        console.log('useEffect inside main');
        const stream = new MediaStream();
        // videoPLayer.current.srcObject = stream;
        // videoPeerConnection.ontrack = (event) => {
        //     stream.addTrack(event.track);
        // };
        // audioPeerConnection.ontrack = (event) => {
        //     stream.addTrack(event.track);
        // };
    }, [videoPeerConnection, audioPeerConnection])

    return (
        <>
            {/* <button onClick={startcall}>start call</button> */}
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