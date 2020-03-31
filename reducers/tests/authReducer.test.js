import authReducer from '../authReducer';

test('should set current user for login', () => {
    const action = {
        type: 'SET_CURRENT_USER',
        payload: 'randomUsername'
    };
    const state = authReducer({}, action);
    expect(state.user).toBe('randomUsername');
    expect(state.isAuthenticated).toEqual(true);
});