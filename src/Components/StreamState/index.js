import React, { useState } from "react";
import { Col } from 'antd';
import { WifiOutlined } from '@ant-design/icons';
import emitter from "../../Modules/emitter";

const StreamStata = () => {
    const [state, setStata] = useState('good');
    emitter.addListener('connectionStata', (state) => {
        setStata(state);
    })
    return (
        <>
            <Col span={12}>
                <WifiOutlined />
                {
                    state === 'good'
                        ? <>Good</>
                        : <>Bad</>
                }
            </Col>
        </>
    );
}

export default StreamStata;