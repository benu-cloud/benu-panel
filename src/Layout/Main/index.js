import React from 'react';
import { Layout, theme } from 'antd';
import FooterLayout from '../Footer';
import HeaderLayout from '../Header';

import './Main.css';

const { Content } = Layout;

const MainLayout = ({ children, renderFotter = true, renderHeader = true }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout className="layout">
            {
                renderHeader ?
                    <HeaderLayout />
                    : null
            }
            <Content>
                <div
                    className="site-layout-content"
                    style={{
                        background: colorBgContainer,
                    }}
                >
                    {children}
                </div>
            </Content>
            {
                renderFotter ?
                    <FooterLayout />
                    : null
            }
        </Layout>
    );
};
export default MainLayout;