import {Cookies} from 'react-cookie';

const cookies = new Cookies();

export const setCookies = (name: string, value: string) => {
    const options = { path: '/' }
    return cookies.set(name, value, options);
}

export const getCookies = (name: string) => {
    return cookies.get(name);
}

export const delCookies = (name: string) => {
    const options = { path: '/' }
    return cookies.remove(name, options);
}