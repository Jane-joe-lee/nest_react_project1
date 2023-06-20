import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, theme } from 'antd';
const { Sider } = Layout;

const SiderPage = ({ menuItems, defaultKeys, openKeys, basePath }) => {

    const navigate = useNavigate();

    const onSubMenuClick = (e) => {
        navigate(`${basePath}/${e.key}`);
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();


    return (
        <Sider style={{background: colorBgContainer }} width={260} >
            <Menu
                onClick={onSubMenuClick}
                defaultSelectedKeys={defaultKeys}
                defaultOpenKeys={openKeys}
                mode="inline"
                items={menuItems}
            />
        </Sider>
    );

};


export default SiderPage