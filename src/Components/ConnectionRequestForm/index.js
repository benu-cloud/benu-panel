import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConnectionRequestForm = () => {
    let navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const showError = (msg) => {
        messageApi.open({
            type: 'error',
            content: msg,
            duration: 8,
        });
    };

    const onFinish = (values) => {
        let peerid = values.peerid;
        const validPeerIdRegex = /^([0-9a-z]{3}-[0-9a-z]{3}-[0-9a-z]{3})$/;
        if (validPeerIdRegex.test(peerid)) {
            setLoading(true);
            axios.get(`https://signaling.benucloud.com/checkinfo/${peerid}`)
                .then((response) => {
                    setLoading(false);
                    if (response.data.status === 200) {
                        navigate(`/${peerid}`, {
                            state: "indirect"
                        });
                    }else{
                        showError(response.data.message);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    showError(error.message);
                })
        } else {
            showError("Couldn't find the remote you're trying to connect. You might not be signed in with the right account.");
        }
    };

    return (
        <>
            {contextHolder}
            <Form
                name="connectionRequest"

                onFinish={onFinish}
                layout={"vertical"}
                requiredMark={"hidden"}
                className="connection-request-form"
            >
                <Form.Item
                    name="peerid"
                    rules={[
                        { required: true, message: 'Please input your code!' },
                    ]}
                >
                    <Input placeholder='Enter your code or link' />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" loading={loading} block htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default ConnectionRequestForm;