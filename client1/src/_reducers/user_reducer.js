import {
    LOGIN_USER,
    MYINFO_CHANGE_PW,
    MYINFO_USER,
    PROFILE_IMG_DELETE_USER,
    PROFILE_IMG_USER,
    REGISTER_USER
} from '../_actions/types';

export default function(state = {}, action) {
    switch(action.type) {
        case LOGIN_USER:
            return { ...state, success: action.payload }
            break;
        case REGISTER_USER:
            return { ...state, success: action.payload }
            break;
        case PROFILE_IMG_USER:
            return { ...state, success: action.payload }
            break;
        case PROFILE_IMG_DELETE_USER:
            return { ...state, success: action.payload }
            break;
        case MYINFO_USER:
            return { ...state, success: action.payload }
            break;
        case MYINFO_CHANGE_PW:
            return { ...state, success: action.payload }
            break;
        default:
            return state;

    }
}