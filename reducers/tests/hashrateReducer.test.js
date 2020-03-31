import hashrateReducer from '../hashrateReducer';

test('should clear hashrate data', () => {
    const action = {
        type: 'CLEAR_HASHRATE_DATA'
    };
    const state = hashrateReducer({}, action);
    expect(state.times).toEqual([]);
    expect(state.hashrates).toEqual([]);
    expect(state.hashrate_units).toEqual("");
});