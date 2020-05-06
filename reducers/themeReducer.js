import { SET_THEME_COLORS } from '../actions/types';

const initialState = {
        navbg: "#3626a5",
        navtexts: "#ffffff", 
        btn1color: "#c526d8", 
        btn1texts: "#ffffff",
        btn2color: "#3626a5", 
        btn2texts: "#ffffff",
        fullscreen: "off"
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_THEME_COLORS:
            return {
                navbg: action.payload.navbg,
                navtexts: action.payload.navtexts,
                btn1color: action.payload.btn1color,
                btn1texts: action.payload.btn1texts,
                btn2color: action.payload.btn2color,
                btn2texts: action.payload.btn2texts,
                fullscreen: action.payload.fullscreen
              };
        default:
            return state;
    }
}