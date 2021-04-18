import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signUpReducer from './signUpReducer';

let rootReducer = combineReducers( {
    loginReducer: loginReducer,
    signUpReducer: signUpReducer
} )
export default rootReducer