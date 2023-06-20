import { combineReducers } from 'redux';
import user from './user_reducer';

// combineReducers를 이용해 여러 reducer(user, ...)들을 하나로 합쳐줌
const rootReducer = combineReducers({
    user
})
export default rootReducer;