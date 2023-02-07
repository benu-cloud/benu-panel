import React, { useEffect, useState } from "react";
import { Col } from 'antd';
import { WifiOutlined } from '@ant-design/icons';
import emitter from "../../Modules/emitter";

const StreamStata = () => {
    const [status, setStatus] = useState("good");
    useEffect(() => {
        let lastPacketlossPct = 0;
        let lastStatus = "good";
        const statListener = emitter.addListener('webrtcStats', (stats) => {
            if(stats.packetsLostPct > lastPacketlossPct && lastStatus==="good"){
                setStatus("bad");
                lastStatus = "bad";
            }else if(stats.packetsLostPct < lastPacketlossPct && lastStatus === "bad"){
                setStatus("good");
                lastStatus = "good";
            }
            lastPacketlossPct = stats.packetsLostPct;
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