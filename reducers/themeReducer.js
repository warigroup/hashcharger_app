import { SET_THEME_COLORS } from '../actions/types';

const initialState = {
        navbg: "#3626a5",
        navtexts: "#ffffff", 
        btn1color: "#c526d8", 
        btn1texts: "#ffffff",
        btn2color: "#3626a5", 
        btn2texts: "#ffffff",
        nightmode: "off"
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_THEME_COLORS:
            return {
                ...state,
                navbg: action.payload[0].navbg,
                navtexts: action.payload[0].navtexts,
                btn1color: action.payload[0].btn1color,
                btn1texts: action.payload[0].btn1texts,
                btn2color: action.payload[0].btn2color,
                btn2texts: action.payload[0].btn2texts,
                nightmode: action.payload[0].nightmode
              };
        default:
            return state;
    }
}