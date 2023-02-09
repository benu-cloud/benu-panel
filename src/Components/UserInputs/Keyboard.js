import { useEffect } from "react";
import emitter from '../../Modules/emitter';

const KeyboardInput = ({ sendToServer }) => {
    useEffect(() => {
        let pressedKey = {};
        const adcEvent = emitter.addListener('sendACD', () => { console.log('get Alt+Ctrl+Del') });
        let keyUpHandler = (e) => {
            e.preventDefault();
            if (e.key in pressedKey) {
                console.log(`${e.key} => up`);
                sendToServer(`k,${e.key},0`);
                delete pressedKey[e.key];
            }
        };
        let keyDownHandler = (e) => {
            e.preventDefault();
            if (!(e.key in pressedKey)) {
                console.log(`${e.key} => down`);
                sendToServer(`k,${e.key},1`);
                pressedKey[e.key] = "";
            }
        };
        let onBlur = () => {
            for (const i in pressedKey) {
                console.log(`${i} => up`);
                sendToServer(`k,${i},0`);
            }
            pressedKey = {};
        };
        window.addEventListener("blur", onBlur);
        if (typeof document !== 'undefined') {
            document.addEventListener('keydown', keyDownHandler, false);
            document.addEventListener('keyup', keyUpHandler, false);
        }
        return () => {
            document.removeEventListener('keydown', keyDownHandler, false);
            document.removeEventListener('keyup', keyUpHandler, false);
            window.removeEventListener("blur", onBlur);
            adcEvent.remove();
        }
    }, [sendToServer]);
}

export default KeyboardInput;