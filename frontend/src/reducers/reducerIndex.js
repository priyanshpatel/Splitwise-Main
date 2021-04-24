import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signUpReducer from './signUpReducer';
import commentsReducer from './commentsReducer';
import profileReducer from './profileReducer';
import groupReducer from './groupReducer';
import dashboardReducer from './dashboardReducer';
import settleUpReducer from './settleUpReducer';

let rootReducer = combineReducers( {
    loginReducer: loginReducer,
    signUpReducer: signUpReducer,
    commentsReducer: commentsReducer,
    profileReducer: profileReducer,
    groupReducer: groupReducer,
    dashboardReducer: dashboardReducer,
    settleUpReducer: settleUpReducer,
} )
export default rootReducer