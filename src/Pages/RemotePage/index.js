import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Typography } from 'antd';

import MainLayout from '../../Layout/Main';
import LiveStream from '../../Components/LiveStream';
import RemoteMenu from '../../Components/RemoteMenu';
import "./index.css";
import loadingLogo from "../../Assets/logo-loading.png";
import { useRef } from 'react';
import useFullScreen from '../../Hooks/FullScreen';

const { Title } = Typography;

const RemotePage = () => {
    let { id } = useParams();
    let navigate = useNavigate();
    const [loading, setloading] = useState(false);
    const videoRef = useRef(null);
    const { fullScreen, ToggleFullScreen } = useFullScreen(videoRef);

    useEffect(() => {
        const validPeerIdRegex = /^([0-9a-z]{3}-[0-9a-z]{3}-[0-9a-z]{3})$/;
        if (!validPeerIdRegex.test(id)) {
            navigate("/404");
        }
    }, [])

    return (
        <MainLayout renderHeader={false} renderFotter={false}>
            <Row style={{ padding: '0px' }}>
                <Col span={24}>
                    {
                        loading
                            ? <div className="remotePageLoading">
                                <img src={loadingLogo} alt="benu loading icon" />
                                <Title level={4}>Loading...</Title>
                            </div>
                            : <div ref={videoRef}>
                                <RemoteMenu fullScreen={fullScreen} toggleFullScreen={ToggleFullScreen} />
                                <LiveStream otherPeerid={id} />
                            </div>
                    }
                </Col>
            </Row>
        </MainLayout>
    );
}

export default RemotePage;