import {applyMiddleware, combineReducers, createStore, compose} from "redux";
import thunkMiddleware from "redux-thunk";
import toursReducer from "./reducers/toursReducer.js";


let reducersStack = combineReducers({
    tours: toursReducer
})

//connect redux chrome extension. delete after develop
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(reducersStack, composeEnhancers(applyMiddleware(thunkMiddleware)));

export default store;