import React, { useState } from 'react'
import { delCookies, getCookies, setCookies } from "../../../common/cookie";
import { COOKIE_JWT_NAME, COOKIE_USER_LEVEL, COOKIE_USER_NAME } from "../../../common/vars/vars";
import { Link, useNavigate } from 'react-router-dom';
import { getLoginInfo } from "../../../_actions/user_action";
import { useDispatch } from "react-redux";
import type { MenuProps } from 'antd';
import { Menu, Layout } from 'antd';
const { Header } = Layout;

function HeaderPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';
    let x_username = getCookies(COOKIE_USER_NAME) ?? '';
    let x_level = getCookies(COOKIE_USER_LEVEL) ?? '';

    if ( x_auth && !x_username ) {
        dispatch(getLoginInfo()).then(response => {
            if ( response.payload.success ) {
                x_username = response.payload.data.username;
                x_level = response.payload.data.level;
                setCookies(COOKIE_USER_NAME, x_username);
                setCookies(COOKIE_USER_LEVEL, x_level);
            }
        });
    }

    // 로그아웃
     const LogoutHandler = async (event) => {
        event.preventDefault(); // submit 누를 때마다 refresh 되는 것을 방지하기 위해 (유효성 검증을 위해)
        await delCookies(COOKIE_JWT_NAME);
        await delCookies(COOKIE_USER_NAME);
        await delCookies(COOKIE_USER_LEVEL);
        navigate("/users/login");
    }

    // 메뉴 셋팅
    const [menuCurrent, setMenuCurrent] = useState('');
    let menuItems: MenuProps['items'];
    if ( x_auth ) {
        menuItems = [
            { label: (<Link to="/">HOME</Link>), key: 'home'},
            {
                label: (<Link to="/users/mypage">MYPAGE</Link>), key: 'mypage',
                children: [
                    { label: (<Link to="/users/profile">프로필 편집</Link>), key: 'profile' },
                    { label: (<Link to="/users/password">비밀번호 변경</Link>), key: 'password' }
                ]
            },
            { label: (<span onClick={LogoutHandler}>LOGOUT</span>), key: 'logout'}
        ];
    } else {
        menuItems = [
            { label: (<Link to="/">HOME</Link>), key: 'home'},
            { label: (<Link to="/users/register">REGISTER</Link>), key: 'register'},
            { label: (<Link to="/users/login">LOGIN</Link>), key: 'login'}
        ];
    }
    const onMenuClick: MenuProps['onClick'] = (event) => {
        setMenuCurrent(event.key);
    };


    return (
        <Header>
            <Menu onClick={onMenuClick} selectedKeys={[menuCurrent]} mode="horizontal" items={menuItems} />
        </Header>
    );
}

export default HeaderPage