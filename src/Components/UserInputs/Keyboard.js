import { useEffect } from "react";

const KeyboardInput = ({ sendToServer }) => {

    useEffect(() => {
        let pressedKey = {};
        let keyUpHandler = (e) => {
            e.preventDefault();
            if (e.code in pressedKey) {
                console.log(`${e.code} => up`);
                delete pressedKey[e.code];
            }
        };
        let keyDownHandler = (e) => {
            e.preventDefault();
            if (!(e.code in pressedKey)) {
                console.log(`${e.code} => down`);
                pressedKey[e.code] = "";
            }
        };
        let onBlur = () => {
            for (const i in pressedKey) {
                console.log(`${i} => up`);
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
            window.removeEventListener("blur", onBlur)
        }
    }, []);
}

export default KeyboardInput;