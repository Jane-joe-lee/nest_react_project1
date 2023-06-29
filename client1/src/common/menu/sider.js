import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { BoardsTypeOptions } from "../vars/vars";

function getItem(label, key, icon, children, type) {
    return { key, icon, children, label, type };
}

// 마이페이지 서브메뉴
export const subMenu_myPageitems = [
    getItem('내정보 수정', 'mypage', '', [
        getItem('프로필 이미지 편집', 'profile', <UserOutlined />),
        getItem('비밀번호 변경',  'password', <KeyOutlined />)
    ]),
];

// 게시판 서브메뉴
export const subMenu_Boards = [
    //getItem('게시판', 'boards', '', [])
    getItem('게시판', 'boards', '', BoardsTypeOptions.map((option) => ({
        label: option.label,
        value: option.value,
        key: option.value,
    }))),
];
