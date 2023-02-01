import React, { useEffect, useRef, useState } from "react";

const MouseInput = ({ sendToServer }) => {
    const [pointerLockStatus, setPointerLockStatus] = useState(false);

    const divRef = useRef();

    let evenLisnter = {};

    const onMouseMove = (e) => {
        console.log(`x: ${e.movementX}, y: ${e.movementY}`);
    }

    const onMouseDown = (e) => {
        console.log(`${e.button} --> ${e.type}`);
    }

    const onMouseUp = (e) => {
        console.log(`${e.button} --> ${e.type}`);
    }
    const onWheel = (e) => {
        console.log(`scroll ${e.deltaX} --> ${-1 * e.deltaY}`);
    }

    const makePointerLock = () => {
        divRef.current.requestPointerLock = divRef.current.requestPointerLock || divRef.current.mozRequestPointerLock;
        divRef.current.requestPointerLock().then(() => { }, () => { });
    }

    if (pointerLockStatus) {
        evenLisnter = {
            onMouseMove: onMouseMove,
            onMouseDown: onMouseDown,
            onMouseUp: onMouseUp,
            onWheel: onWheel
        }
    } else {
        evenLisnter = {
            onClick: makePointerLock
        }
    }
    useEffect(() => {
        const lockChangeAlert = () => {
            if (document.pointerLockElement === divRef.current || document.mozPointerLockElement === divRef.current) {
                setPointerLockStatus(true);
            } else {
                setPointerLockStatus(false);
            }
        }
        const lockPointerOnFullScreen = () => {
            if (document.fullscreenElement) {
                divRef.current.requestPointerLock = divRef.current.requestPointerLock || divRef.current.mozRequestPointerLock;
                divRef.current.requestPointerLock().then(() => { }, () => { });
            }
        }
        document.addEventListener("pointerlockchange", lockChangeAlert, false);
        document.addEventListener("fullscreenchange", lockPointerOnFullScreen, false);
        return () => {
            document.removeEventListener("pointerlockchange", lockChangeAlert, false);
            document.removeEventListener("fullscreenchange", lockPointerOnFullScreen, false);
        }
    });

    return (
        <div
            onContextMenu={(e) => {
                e.preventDefault();
            }}
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
            }}
            ref={divRef}
            {...evenLisnter}
        >
        </div>
    );
};

export default MouseInput;