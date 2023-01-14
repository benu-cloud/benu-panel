import React from 'react';
import { Col, Row, Typography } from 'antd';
import MainLayout from '../../Layout/Main';
import ConnectionRequestForm from '../../Components/ConnectionRequestForm';
import logo from "../../Assets/benu-logo-type-black.png"; // #TODO, import and link from public insted of asstes
import "./index.css";

const { Title } = Typography;

const MainPage = () => {
  return (
    <div className="App">
      <MainLayout>
        <Row justify={'center'}>
          <Col md={4} sm={10} xs={15} className="main-layout-form">
            <img src={logo} alt="benu logo type remote connection" />
            <Title level={4}>Login to your remote</Title>
            <ConnectionRequestForm />
          </Col>
        </Row>
      </MainLayout>
    </div>
  );
}

export default MainPage;