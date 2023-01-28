import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Typography } from 'antd';
import { FullscreenOutlined, WifiOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import emitter from '../../Modules/emitter';
import StreamStata from "../StreamState";
import './index.css';
import logo from "../../Assets/benu-logo-type-black.png";

const { Text } = Typography;


const RemoteMenu = ({ fullScreen, toggleFullScreen, sendACD, loading }) => {
    let navigate = useNavigate();
    const [menuCollaps, setMenuCollaps] = useState(false);

    return (
        <>
            {
                loading
                    ? null
                    : <Row className="remote-menu-container">
                        <Col span={20} className="remote-menu-item">
                            <Row onClick={() => setMenuCollaps(!menuCollaps)}>
                                <Col span={12}><img src={logo} /></Col>
                                <StreamStata />
                            </Row>
                        </Col>
                        <Col span={4} className="collaps-icon-box" onClick={() => setMenuCollaps(!menuCollaps)} >{menuCollaps ? <DownOutlined /> : <UpOutlined />}</Col>
                        {
                            menuCollaps
                                ? <>
                                    <Col span={24} className="remote-menu-item" onClick={() => toggleFullScreen()}>
                                        <Row>
                                            <Col span={20}>
                                                {
                                                    fullScreen
                                                        ? <>Exit full screen</>
                                                        : <>Full screen</>
                                                }
                                            </Col>
                                            <Col span={2}><FullscreenOutlined /></Col>
                                        </Row>
                                    </Col>
                                    <Col span={24} className="remote-menu-item" onClick={() => emitter.emit('sendACD')}>
                                        <Row>
                                            <Col span={24}>Send Alt+Crtl+Del</Col>
                                        </Row>
                                    </Col>
                                    <Col span={24} className="remote-menu-item" onClick={() => navigate("/")}>
                                        <Row>
                                            <Col span={24}><Text type="danger">Disconnect</Text></Col>
                                        </Row>
                                    </Col>
                                </>
                                : null
                        }
                    </Row>
            }
        </>
    );
}

export default RemoteMenu;