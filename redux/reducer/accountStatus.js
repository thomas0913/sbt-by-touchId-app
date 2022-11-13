import * as action from "../action/accountStatus";

const initState = {
    alreadylogin_state: false,
    wallet_status: false,
    wallet_network_status: false,
    wallet_account: null,
    permission_status: false,
    isManager: false
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
    if (action.type === 'UPDATING_WALLET_STATUS') {
        return Object.assign({}, state, {
            wallet_status: action.wallet_status_detail
        });
    }
    if (action.type === 'UPDATING_WALLET_NETWORK_STATUS') {
        return Object.assign({}, state, {
            wallet_network_status: action.wallet_network_status_detail
        });
    }
    if (action.type === 'UPDATING_WALLET_ACCOUNT') {
        return Object.assign({}, state, {
            wallet_account: action.wallet_account_detail
        });
    }
    if (action.type === 'UPDATING_PERMISSION_STATUS') {
        return Object.assign({}, state, {
            permission_status: action.permission_status_detail
        });
    }
    if (action.type === 'CHECK_IF_IS_MANAGER') {
        return Object.assign({}, state, {
            isManager: action.isManager_detail
        });
    }
    return state;
}

export default accountStatusReducer;