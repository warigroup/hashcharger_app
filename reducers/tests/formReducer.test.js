import formReducer from '../formReducer';

test('should block navigation on form submission', () => {
    const action = {
        type: 'FORM_SUBMITTED'
    };
    const state = formReducer({}, action);
    expect(state.blocknav).toBe('block');
});

test('should enable navigation after form submission', () => {
    const action = {
        type: 'ENABLE_NAVIGATION'
    };
    const state = formReducer({}, action);
    expect(state.blocknav).toBe('enable');
});