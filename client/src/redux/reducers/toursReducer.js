import * as axios from "axios";

const defaultState = {
    tours: []
}

const SET_TOURS = 'toursReducer/SET_TOURS'

const toursReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_TOURS: {
            return {
                ...state
            }
        }
        default:
            return state;
    }
}

export default toursReducer