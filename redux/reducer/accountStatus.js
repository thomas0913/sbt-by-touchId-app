import * as action from "../action/accountStatus";

const initState = {
    alreadylogin_state: false
}

const accountStatusReducer = (state = initState, action) => {
    if (action.type === 'ACCOUNT_LOGIN_SUCCESS') {
        return Object.assign({}, state, {
            alreadylogin_state: true
        });
    }
    if (action.type === 'ACCOUNT_LOGIN_FAIL') {
        return Object.assign({}, state, {
            alreadylogin_state: false
        });
    }
    return state;
}

export default accountStatusReducer;