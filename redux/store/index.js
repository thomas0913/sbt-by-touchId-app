import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import accountStatusReducer from "../reducer/accountStatus";
import sbt_user_Reducer from "../reducer/sbt_user";

const rootReducer = combineReducers({
    accountStatus: accountStatusReducer,
    sbt_user: sbt_user_Reducer
});

const loggerMiddleware = createLogger();

const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));

store.subscribe(() => {
    console.log("state updated");
    console.log(store.getState());
});

export default store;