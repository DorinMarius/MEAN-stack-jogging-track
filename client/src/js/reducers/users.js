import {
  USERS_UPDATED,
  USER_UPDATED,
  USER_DELETED,
  USER_LOGGED_OUT
} from '../actions';

import {
  updateList,
  updateOneById,
  deleteById
} from './common';

export default (state = [], action) => {
  switch (action.type) {
    case USERS_UPDATED:
      return updateList(state, action.users.reverse());

    case USER_UPDATED: {
      const user = Object.assign({roles: []}, action.user);
      return updateOneById(state, user);
    }

    case USER_DELETED:
      return deleteById(state, action.id);

    case USER_LOGGED_OUT:
      return [];

    default:
      return state;
  }
};
