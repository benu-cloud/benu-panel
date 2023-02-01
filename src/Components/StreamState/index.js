import React, { useEffect } from "react";
import { Col } from 'antd';
import { WifiOutlined } from '@ant-design/icons';
import emitter from "../../Modules/emitter";

const StreamStata = () => {
    const status = "good";
    useEffect(() => {
        const statListener = emitter.addListener('webrtcStats', (stats) => {
            // console.log(stats);
            // setStata(state);
        });
        return () => {
            statListener.remove();
        }
    }, [])
    return (
        <>
            <Col span={12}>
                <WifiOutlined />
                {
                    status === 'good'
                        ? <>Good</>
                        : <>Bad</>
                }
            </Col>
        </>
    );
}

export default StreamStata;