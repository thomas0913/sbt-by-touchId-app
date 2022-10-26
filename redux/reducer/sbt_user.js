import * as action from "../action/accountStatus";

const initState = {
    username: ""
}

const sbt_user_Reducer = (state = initState, action) => {
    if (action.type === 'STORING_USERNAME') {
        return Object.assign({}, state, {
            username: action.username_detail
        });
    }
    return state;
}

export default sbt_user_Reducer;