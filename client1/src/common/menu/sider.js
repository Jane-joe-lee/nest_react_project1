import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";

function getItem(label, key, icon, children, type) {
    return { key, icon, children, label, type };
}

export const subMenu_myPageitems = [
    getItem('내정보 수정', 'mypage', '', [
        getItem('프로필 이미지 편집', 'profile', <UserOutlined />),
        getItem('비밀번호 변경',  'password', <KeyOutlined />)
    ]),
];
