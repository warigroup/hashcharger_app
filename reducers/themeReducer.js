import { SET_THEME_COLORS } from '../actions/types';

const initialState = {
        navbg: "#3626a5",
        navtexts: "#ffffff", 
        primary: "#3626a5",
        secondary: "#c526d8",
        buttontexts: "#ffffff",
        tabletexts: "#ffffff",
        fullscreen: "off"
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_THEME_COLORS:
            return {
                ...state,
                navbg: '#' + action.payload[0].navbg,
                navtexts: '#' + action.payload[1].navtexts,
                primary: '#' + action.payload[2].primary,
                secondary: '#' + action.payload[3].secondary,
                buttontexts: '#' + action.payload[4].buttontexts,
                tabletexts: '#' + action.payload[5].tabletexts,
                fullscreen: '#' + action.payload[6].fullscreen
              };
        default:
            return state;
    }
}