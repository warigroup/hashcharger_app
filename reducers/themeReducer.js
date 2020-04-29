import { SET_THEME_COLORS } from '../actions/types';

const initialState = {
    colors: { 
        navbg: "",
        navtexts: "", 
        btncolor: "", 
        btntexts: "",
        nightmode: ""
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_THEME_COLORS:
            return action.payload;
        default:
            return state;
    }
}