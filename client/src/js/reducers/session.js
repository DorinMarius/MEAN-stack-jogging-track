import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT
} from '../actions';

const initState = JSON.parse(localStorage.getItem('session')) || {};

export default (state = initState, action) => {
  switch (action.type) {
    case USER_LOGGED_IN:
      return Object.assign({}, state, {
        userId: action.userId,
        token: action.token
      });
    case USER_LOGGED_OUT:
      return {};
    default:
      return state;
  }
};
