import React from 'react';
import { Col, Row } from 'antd';
import MainLayout from '../Layout/Main';
import ConnectionRequestForm from '../Components/ConnectionRequestForm';


const MainPage = () => {
  return (
    <div className="App">
      <MainLayout>
        <Row justify={'center'}>
          <Col span={10}>
            <ConnectionRequestForm />
          </Col>
        </Row>
      </MainLayout>
    </div>
  );
}

export default MainPage;