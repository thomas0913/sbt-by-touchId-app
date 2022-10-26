export const ACCOUNT_LOGIN_SUCCESS = "ACCOUNT_LOGIN_SUCCESS";
export const ACCOUNT_LOGIN_FAIL = "ACCOUNT_LOGIN_FAIL";

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