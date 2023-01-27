import { useState, useEffect } from 'react';

const useFullScreen = (item) => {

    const [fullScreen, setFullScreen] = useState(false);
    const MakeFullScreen = () => {
        if (item && item.current) {
            if( 'keyboard' in navigator && 'lock' in navigator.keyboard){
                navigator.keyboard.lock()
            }
            if (item.current.requestFullscreen) {
                item.current.requestFullscreen();
            } else if (item.current.msRequestFullscreen) {
                item.current.msRequestFullscreen();
            } else if (item.current.mozRequestFullScreen) {
                item.current.mozRequestFullScreen();
            } else if (item.current.webkitRequestFullscreen) {
                item.current.webkitRequestFullscreen();
            }
        }
    };

    const ExitFullscreen = () => {
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    };

    const ToggleFullScreen = () => {
        setFullScreen(!fullScreen);
    }

    useEffect(() => {
        if (item && item.current) {
            document.onfullscreenchange = (event) => {
                if (document.fullscreenElement !== event.target) {
                    setFullScreen(false);
                }
            };
        }
    }, [item]);

    useEffect(() => {
        if (fullScreen) {
            MakeFullScreen();
        } else {
            ExitFullscreen();
        }
    }, [fullScreen]);

    return { fullScreen, ToggleFullScreen };
}

export default useFullScreen;