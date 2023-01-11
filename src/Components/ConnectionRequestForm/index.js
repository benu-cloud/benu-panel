import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';


const ConnectionRequestForm = () => {
    let navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const error = () => {
        messageApi.open({
            type: 'error',
            content: "Couldn't find the remote you're trying to connect. You might not be signed in with the right account.",
            duration: 8,
        });
    };

    const onFinish = (values) => {
        let peerid = values.peerid;
        const validPeerIdRegex = /^([0-9a-z]{3}-[0-9a-z]{3}-[0-9a-z]{3})$/;
        if (true || validPeerIdRegex.test(peerid)) {
            navigate(`/${peerid}`);
        } else {
            error();
        }
    };

    return (
        <>
            {contextHolder}
            <Form
                name="connectionRequest"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Enter code or link"
                    name="peerid"
                    rules={[
                        { required: true, message: 'Please input your code!' },
                    ]}
                >
                    <Input placeholder='Enter code or link' />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Connect
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default ConnectionRequestForm;