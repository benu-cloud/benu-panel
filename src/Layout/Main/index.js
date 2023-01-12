import React from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import FooterLayout from '../Footer';
import HeaderLayout from '../Header';

import './Main.css';

const { Content } = Layout;

const MainLayout = ({ children, renderFotter = false, renderHeader = false }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <ConfigProvider
            theme={{ token: { colorPrimary: "#000000", "borderRadius": 10 } }}
        >
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
        </ConfigProvider>
    );
};
export default MainLayout;