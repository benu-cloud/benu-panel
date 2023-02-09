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
            .then(() => {
                setLoading(false);
                setConfirmConnecting(false);
            })
            .catch((error) => {
                setLoading(false);
                if (error.response.data) {
                    message.error(error.response.data.message, 5);
                    navigate("/");
                }
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