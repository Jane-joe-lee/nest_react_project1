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
        case REGISTER_USER:
        case PROFILE_IMG_USER:
        case PROFILE_IMG_DELETE_USER:
        case MYINFO_USER:
        case MYINFO_CHANGE_PW:
            return { ...state, success: action.payload }
            break;
        default:
            return state;

    }
}