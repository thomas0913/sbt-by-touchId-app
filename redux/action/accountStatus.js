export const ACCOUNT_LOGIN_SUCCESS = "ACCOUNT_LOGIN_SUCCESS";
export const ACCOUNT_LOGIN_FAIL = "ACCOUNT_LOGIN_FAIL";
export const UPDATING_WALLET_STATUS = "UPDATING_WALLET_STATUS";
export const UPDATING_WALLET_NETWORK_STATUS = "UPDATING_WALLET_NETWORK_STATUS";
export const UPDATING_WALLET_ACCOUNT = "UPDATING_WALLET_ACCOUNT";
export const UPDATING_PERMISSION_STATUS = "UPDATING_PERMISSION_STATUS";
export const CHECK_IF_IS_MANAGER = "CHECK_IF_IS_MANAGER";

export const accountLoginSuccess = () => {
    return {
        type: ACCOUNT_LOGIN_SUCCESS
    }
}

export const accountLoginFail = () => {
    return {
        type: ACCOUNT_LOGIN_FAIL
    }
}
export const updatingWalletStatus = (data) => {
    return {
        type: UPDATING_WALLET_STATUS,
        wallet_status_detail: data
    }
}
export const updatingWalletNetworkStatus = (data) => {
    return {
        type: UPDATING_WALLET_NETWORK_STATUS,
        wallet_network_status_detail: data
    }
}
export const updatingWalletAccount = (data) => {
    return {
        type: UPDATING_WALLET_ACCOUNT,
        wallet_account_detail: data
    }
}
export const updatingPermissionStatus = (data) => {
    return {
        type: UPDATING_PERMISSION_STATUS,
        permission_status_detail: data
    }
}

export const checkIfIsManager = (data) => {
    return {
        type: CHECK_IF_IS_MANAGER,
        isManager_detail: data
    }
}