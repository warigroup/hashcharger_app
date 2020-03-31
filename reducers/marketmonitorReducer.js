import {
    LOAD_ACTIVE_OFFERS
 } from "../actions/types";
 
 const initialState = {
   active_offers: {
     "result": [],
     "total_pages": [],
     "page": []
   },
   offers_loaded: false
 };
 
 export default function(state = initialState, action) {
   switch (action.type) {
     case LOAD_ACTIVE_OFFERS:
       return {
         ...state,
         active_offers: action.payload,
         offers_loaded: true
       };
     default:
       return state;
   }
 }
 