
export const BACK_API_URI = 'http://localhost:5001';

export const COOKIE_JWT_NAME = 'x_auth'; // JWT TOKEN
export const COOKIE_USER_NAME = 'x_username'; // 로그인사용자 username
export const COOKIE_USER_LEVEL = 'x_userlevel'; // 로그인사용자 level


// 게시판 type
export const BoardsTypeDefault = 'notice';
export const BoardsTypeOptions = [
    { value: 'notice', label: 'NOTICE' },
    { value: 'free', label: 'FREE' }
];


// 게시판 검색조건
export const BoardsSearchDefault = 'title';
export const BoardsSearchType = [
    { value: 'title', label: '제목' },
    { value: 'username', label: '작성자' }
]

export const BoardsStatusDefault = 'PUBLIC';
export const BoardsStatus = [
    { value: 'PUBLIC', label: '공개' },
    { value: 'PRIVATE', label: '비공개' }
]