import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Row, Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import MainLayout from '../../Layout/Main';
import LiveStream from '../../Components/LiveStream';
import "./index.css";
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const RemotePage = () => {
    let { uuid, id } = useParams();
    let navigate = useNavigate();
    const [loading, setloading] = useState(true);
    // const uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    //     (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    // );
    useEffect(() => {
        // const validPeerIdRegex = /^([0-9a-z]{3}-[0-9a-z]{3}-[0-9a-z]{3})$/;
        // if (!validPeerIdRegex.test(id)) {
        //     navigate("/404");
        // }
    }, [])
    return (
        <div className="App">
            <MainLayout renderHeader={false} renderFotter={false}>
                <Row style={{ padding: '0px' }}>
                    <Col span={24}>
                        <LiveStream otherPeerid={id} peerid={uuid} />
                        {
                            loading
                                ? <div style={{ height: '90vh', textAlign: 'center', padding: '25%' }}>
                                    <Spin className="remotePageLoading" size="large" tip="Loading..." indicator={loadingIcon} />
                                </div>
                                : null
                        }
                    </Col>
                </Row>
            </MainLayout>
        </div>
    );
}

export default RemotePage;