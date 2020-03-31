import { setCurrentUser } from '../warihashApiCalls';

test('should generate login action object', () => {
    const username = 'fakeUsername';
    const action = setCurrentUser(username);
    expect(action).toEqual({
        payload: username,
        type: 'SET_CURRENT_USER'
    })
});