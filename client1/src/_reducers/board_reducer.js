import {
    TBBS_EDIT, TBBS_LIKE_UPDATE, TBBS_DELETE, TBBS_LIST, TBBS_VIEW, TBBS_CREATE
} from '../_actions/types';

export default function(state = {}, action) {
    switch(action.type) {

        case TBBS_LIST:
        case TBBS_VIEW:
        case TBBS_EDIT:
        case TBBS_DELETE:
        case TBBS_LIKE_UPDATE:
        case TBBS_CREATE:
            return { ...state, success: action.payload }
            break;
        default:
            return state;

    }
}