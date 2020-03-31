import { GET_STATS_DATA } from '../actions/types';

const initialState = {
    user_count: "",
    best_offer: {},
    available: {sha256d: {hashrate: "", hashrate_units: ""}, 
    scrypt: {hashrate: "", hashrate_units: ""}}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_STATS_DATA:
            return action.payload;
        default:
            return state;
    }
}