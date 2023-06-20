import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import HeaderPage from "../Nav/HeaderPage";
import FooterPage from "../Nav/FooterPage";
import { getCookies } from "../../../common/cookie";
import { COOKIE_JWT_NAME } from "../../../common/vars/vars";
import { Layout } from 'antd';
import { subMenu_myPageitems } from "../../../common/menu/sider";
import SiderPage from "../Nav/SiderPage";
import PathBar from "../Nav/PathBar";

const { Content } = Layout;


function MyPage(props) {

    const navigate = useNavigate();
    const basePath = '/users';

    // 이미 로그인되지 않은 경우 페이지 이동
    useEffect(() => {
        const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';
        if ( !x_auth ) {
            navigate("/users/login");
        }
    }, [navigate]);

    return (
        <Layout>
            <HeaderPage />
            <Content>
                <PathBar path2="MYPAGE" />
                <Layout hasSider>
                    <SiderPage menuItems={subMenu_myPageitems} defaultKeys={['mypage']} openKeys={['mypage']} basePath={basePath} />
                    <Content className="basic_layout">
                        <h2>마이 페이지</h2>
                    </Content>
                </Layout>

            </Content>
            <FooterPage />
        </Layout>
    );
}
export default MyPage