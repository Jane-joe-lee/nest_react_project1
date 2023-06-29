import axios from 'axios';
import { TBBS_LIST, TBBS_VIEW, TBBS_EDIT, TBBS_DELETE, TBBS_LIKE_UPDATE, TBBS_CREATE } from './types';
import { getCookies } from "../common/cookie";
import { BACK_API_URI, COOKIE_JWT_NAME } from "../common/vars/vars";

// 게시판 list
export async function getBoardList(dataToSubmit) {
    const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';

    const request = await axios.get(`${BACK_API_URI}/boards/list/${dataToSubmit.type}`, {
        params: dataToSubmit,
        headers: {
            Authorization: `Bearer ${x_auth}`
        }
    })
        .then( response => response.data )
        .catch( error => error.response.data );

    return {
        type: TBBS_LIST,
        payload: request
    }
}

// 게시판 view
export async function getBoardView(dataToSubmit) {
    const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';

    const request = await axios.get(`${BACK_API_URI}/boards/${dataToSubmit.id}`, {
        headers: {
            Authorization: `Bearer ${x_auth}`
        }
    })
        .then( response => response.data )
        .catch( error => error.response.data );

    return {
        type: TBBS_VIEW,
        payload: request
    }
}

// 게시판 추가
export async function getBoardCreate(dataToSubmit) {
    const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';

    const request = await axios.post(`${BACK_API_URI}/boards/create`, dataToSubmit, {
        headers: {
            Authorization: `Bearer ${x_auth}`,
            "Content-Type": 'multipart/form-data',
        }
    })
        .then( response => response.data )
        .catch( error => error.response.data );

    return {
        type: TBBS_CREATE,
        payload: request
    }
}

// 게시판 수정
export async function getBoardEdit(dataToSubmit) {
    const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';

    let id;
    for (let pair of dataToSubmit.entries()) {
        if ( pair[0] === 'id' ) id = pair[1];
    }

    const request = await axios.patch(`${BACK_API_URI}/boards/${id}`, dataToSubmit, {
        headers: {
            Authorization: `Bearer ${x_auth}`,
            'Content-Type': 'multipart/form-data'
        }
    })
        .then( response => response.data )
        .catch( error => error.response.data );

    return {
        type: TBBS_EDIT,
        payload: request
    }
}

// 게시판 삭제
export async function getBoardDelete(dataToSubmit) {
    const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';

    const request = await axios.delete(`${BACK_API_URI}/boards/${dataToSubmit.id}`, {
        headers: {
            Authorization: `Bearer ${x_auth}`
        }
    })
        .then( response => response.data )
        .catch( error => error.response.data );

    return {
        type: TBBS_DELETE,
        payload: request
    }
}

// 게시판 좋아요수 수정
export async function getBoardUpdateLike(dataToSubmit) {
    const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';

    const request = await axios.patch(`${BACK_API_URI}/boards/${dataToSubmit.id}/like`, dataToSubmit, {
        headers: {
            Authorization: `Bearer ${x_auth}`
        }
    })
        .then( response => response.data )
        .catch( error => error.response.data );

    return {
        type: TBBS_LIKE_UPDATE,
        payload: request
    }
}
