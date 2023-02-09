import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, message } from "antd";
import axios from 'axios';
import './index.css';


const ConfirmConnectingForm = ({ setConfirmConnecting, peerid }) => {
    let navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const confirmConnecting = () => {
        setLoading(true);
        axios.get(`https://signaling.benucloud.com/checkinfo/${peerid}`)
            .then((response) => {
                setLoading(false);
                if (response.data.status === 200) {
                    setConfirmConnecting(false);
                } else {
                    message.error(response.data.message, 5);
                    navigate("/");
                }
            })
            .catch((error) => {
                setLoading(false);
                message.error(error.message, 5);
            })
    }

    return (
        <div className='confirm-connecting-box'>
            <p>
                connecting to
                <span> #{peerid}</span> ?
            </p>
            <div className='confirm-connecting-box-buttun-container'>
                <Button type="default" onClick={() => { navigate("/"); }}>Cancel</Button>
                <Button type="primary" loading={loading} onClick={confirmConnecting}>Connect</Button>
            </div>
        </div>
    );
}

export default ConfirmConnectingForm;