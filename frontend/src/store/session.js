import { fetch } from './csrf';

const SET_USER = 'session/SET_USER'
const REMOVE_USER = 'session/REMOVE_USER'

//Action creator to set current user
const setCurrentUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  }
}
//Action creator to remove current user
const removeCurrentUser = () => {
  return {
    type: REMOVE_USER
  }
}

//thunk actions

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await fetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    })
  });
  dispatch(setCurrentUser(response.data.user));
  return response;
}

export const restoreUser = () => async (dispatch) => {
  const res = await fetch('/api/session');
  dispatch(setCurrentUser(res.data.user));
  return res;
}

export const signup = (user) => async (dispatch) => {
  const { username, email, password } = user;
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ username, email, password}),
  });
  dispatch(setCurrentUser(response.data.user));
  return response;
}

export const logout = () => async (dispatch) => {
  const response = await fetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeCurrentUser());
  return response;
}


//reducers

const sessionReducer = (state = { user: null }, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
        newState = Object.assign({}, state);
        newState.user = null;
        return newState;
    default:
      return state;
  }
}

export default sessionReducer;
