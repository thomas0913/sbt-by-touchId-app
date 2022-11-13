import * as action from "../action/accountStatus";

const initState = {
    username: "",
    userWalletAddress: "",
    userBiometricRegisterStatus: false
}

const sbt_user_Reducer = (state = initState, action) => {
    if (action.type === 'STORING_USERNAME') {
        return Object.assign({}, state, {
            username: action.username_detail
        });
    }
    if (action.type === 'STORING_USER_WALLET_ADDRESS') {
        return Object.assign({}, state, {
            userWalletAddress: action.userWalletAddress_detail
        });
    }
    if (action.type === 'UPDATING_USER_BIOMETRIC_REGISTER_STATUS') {
        return Object.assign({}, state, {
            userBiometricRegisterStatus: action.userBiometricRegisterStatus_detail
        });
    }
    return state;
}

export default sbt_user_Reducer;