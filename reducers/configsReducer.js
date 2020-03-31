import { GET_CONFIGS_DATA } from '../actions/types';

const initialState = {
    "server_time": undefined,
    "payment_vehicle": "Bitcoin",
    "sha256d": {
        "proxy": undefined,
        "hashrate_units": undefined,
        "price_hash_units": undefined,
        "price_time_units": undefined,
        "max_order_duration_min": undefined,
        "min_order_duration_min": undefined,
        "min_order_hashrate": [
            {
                "duration_min": undefined,
                "duration_max": undefined,
                "min": undefined
            },
            {
                "duration_min": undefined,
                "duration_max": undefined,
                "min": undefined
            }
        ],
        "max_order_hashrate": [
            {
                "duration_min": undefined,
                "duration_max": undefined,
                "max": undefined
            },
            {
                "duration_min": undefined,
                "duration_max": undefined,
                "max": undefined
            }
        ]
    },
    "ethash": {
        "proxy": undefined,
        "hashrate_units": undefined,
        "price_hash_units": undefined,
        "price_time_units": undefined,
        "max_order_duration_min": undefined,
        "min_order_duration_min": undefined,
        "min_order_hashrate": [
            {
                "duration_min": undefined,
                "duration_max": undefined,
                "min": undefined
            },
            {
                "duration_min": undefined,
                "duration_max": undefined,
                "min": undefined
            }
        ],
        "max_order_hashrate": [
            {
                "duration_min": undefined,
                "duration_max": undefined,
                "max": undefined
            },
            {
                "duration_min": undefined,
                "duration_max": undefined,
                "max": undefined
            }
        ]
    },
    "scrypt": {
        "proxy": undefined,
        "hashrate_units": undefined,
        "price_hash_units": undefined,
        "price_time_units": undefined,
        "max_order_duration_min": undefined,
        "min_order_duration_min": undefined,
        "min_order_hashrate": [
            {
                "duration_min": undefined,
                "duration_max": undefined,
                "min": undefined
            },
            {
                "duration_min": undefined,
                "duration_max": undefined,
                "min": undefined
            }
        ],
        "max_order_hashrate": [
            {
                "duration_min": undefined,
                "duration_max": undefined,
                "max": undefined
            },
            {
                "duration_min": undefined,
                "duration_max": undefined,
                "max": undefined
            }
        ]
    }
}

export default function(state = initialState, action) {
    switch(action.type) {
      case GET_CONFIGS_DATA:
         return action.payload;
      default: 
        return state;
    }
}