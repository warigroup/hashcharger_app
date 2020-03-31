import stratumReducer from '../stratumReducer';

test('stores fetched stratum list data', () => {
    const action = {
        type: 'GET_STRATUM_LIST',
        payload: 'someRandomData'
    };
    const state = stratumReducer({}, action);
    expect(state.stratum_list).toBe('someRandomData');
    expect(state.stratum_loaded).toEqual(true);
});