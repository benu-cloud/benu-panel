import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Typography } from 'antd';

import MainLayout from '../../Layout/Main';
import LiveStream from '../../Components/LiveStream';
import RemoteMenu from '../../Components/RemoteMenu';
import "./index.css";
import loadingLogo from "../../Assets/logo-loading.png";
import { useRef } from 'react';
import useFullScreen from '../../Hooks/FullScreen';
import ConfirmConnectingForm from '../../Components/ConfirmConnectingForm';

const { Title } = Typography;

const RemotePage = () => {
    let { id } = useParams();
    let navigate = useNavigate();
    let incomingType = useLocation().state;
    const validPeerIdRegex = /^([0-9a-z]{3}-[0-9a-z]{3}-[0-9a-z]{3})$/;
    const [confirmConnecting, setConfirmConnecting] = useState(window.performance && (performance.navigation.type === performance.navigation.TYPE_RELOAD || incomingType !== "indirect"));
    if (!validPeerIdRegex.test(id)) {
        navigate("/404");
    }
    const [loading, setLoading] = useState(true);
    const videoRef = useRef(null);
    const { fullScreen, ToggleFullScreen } = useFullScreen(videoRef);

    return (
        <MainLayout renderHeader={false} renderFotter={false}>
            <Row style={{ padding: '0px' }}>
                <Col span={24}>
                    {
                        confirmConnecting
                            ? <ConfirmConnectingForm setConfirmConnecting={setConfirmConnecting} peerid={id}/>
                            : <>
                                {
                                    loading
                                        ? <div className="remotePageLoading">
                                            <img src={loadingLogo} alt="benu loading icon" />
                                            <Title level={4}>Loading...</Title>
                                        </div>
                                        : null
                                }
                                <div ref={videoRef}>
                                    <RemoteMenu loading={loading} fullScreen={fullScreen} toggleFullScreen={ToggleFullScreen} />
                                    <LiveStream loading={loading} setLoading={setLoading} otherPeerid={id} />
                                </div>
                            </>
                    }
                </Col>
            </Row>
        </MainLayout>
    );
}

export default RemotePage;