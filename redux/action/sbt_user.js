export const STORING_USERNAME = "STORING_USERNAME";
export const STORING_USER_WALLET_ADDRESS = "STORING_USER_WALLET_ADDRESS";
export const UPDATING_USER_BIOMETRIC_REGISTER_STATUS = "UPDATING_USER_BIOMETRIC_REGISTER_STATUS";

export const storingUsername = (data) => {
    return {
        type: STORING_USERNAME,
        username_detail: data
    }
}
export const storingUserWalletAddress = (data) => {
    return {
        type: STORING_USER_WALLET_ADDRESS,
        userWalletAddress_detail: data
    }
}
export const updatingUserBiometricRegisterStatus = (data) => {
    return {
        type: UPDATING_USER_BIOMETRIC_REGISTER_STATUS,
        userBiometricRegisterStatus_detail: data
    }
}