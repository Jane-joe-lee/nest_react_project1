import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    PROFILE_IMG_USER,
    PROFILE_IMG_DELETE_USER,
    MYINFO_USER,
    MYINFO_CHANGE_PW
} from './types';
import { getCookies } from "../common/cookie";
import { BACK_API_URI, COOKIE_JWT_NAME } from "../common/vars/vars";

// ,{ withCredentials: true, headers: {'Content-Type': 'application/json'} }

// login
export async function loginUser(dataToSubmit) {
    const request = await axios.post(`${BACK_API_URI}/auth/signin`, dataToSubmit)
        .then( response => response.data )
        .catch( error => error.response.data );

    return {
        type: LOGIN_USER,
        payload: request
    }
}

// register
export async function registerUser(dataToSubmit) {
     const request = await axios.post(`${BACK_API_URI}/auth/signup`, dataToSubmit)
        .then( response => response.data )
        .catch( error => error.response.data );

    // redux : action
    return {
        type: REGISTER_USER,
        payload: request
    }
}

// 프로필 이미지 수정
export async function profileImgUser(dataToSubmit) {

    const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';

    const request = await axios.post(`${BACK_API_URI}/auth/profile`, dataToSubmit, {
        headers: {
            Authorization: `Bearer ${x_auth}`,
            'Content-Type': 'multipart/form-data'
        }
    })
        .then( response => response.data )
        .catch( error => error.response.data );

    return {
        type: PROFILE_IMG_USER,
        payload: request
    }
}


// 프로필 이미지 삭제
export async function profileImgDeleteUser() {

    const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';

    const request = await axios.delete(`${BACK_API_URI}/auth/profile`, {
        headers: {
            Authorization: `Bearer ${x_auth}`
        }
    })
        .then( response => response.data )
        .catch( error => error.response.data );

    return {
        type: PROFILE_IMG_DELETE_USER,
        payload: request
    }
}

// 내정보 조회
export async function getLoginInfo() {

    const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';

    const request = await axios.get(`${BACK_API_URI}/auth/myinfo`, {
        headers: {
            Authorization: `Bearer ${x_auth}`
        }
    })
        .then( response => response.data )
        .catch( error => error.response.data );

    return {
        type: MYINFO_USER,
        payload: request
    }

}

// 비밀번호 변경
export async function setUserPassword(dataToSubmit) {
    const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';

    const request = await axios.post(`${BACK_API_URI}/auth/setPassword`, dataToSubmit, {
        headers: {
            Authorization: `Bearer ${x_auth}`
        }
    })
        .then( response => response.data )
        .catch( error => error.response.data );

    return {
        type: MYINFO_CHANGE_PW,
        payload: request
    }
}
/*
// 인증
export function auth() {
    const request = axios.get('/auth/auth', { withCredentials: true })
        .then(response => response.data );
    //.catch((error) => { console.log(error); });

    // redux : action
    return {
        type: AUTH_USER,
        payload: request
    }

}
*/