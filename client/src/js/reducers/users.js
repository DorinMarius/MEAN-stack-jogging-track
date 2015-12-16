import {
  USERS_UPDATED,
  USER_UPDATED,
  USER_DELETED,
} from '../actions';

import {
  updateList,
  updateOneById,
  deleteById
} from './common';

export default (state = [], action) => {
  switch (action.type) {
    case USERS_UPDATED:
      return updateList(state, action.users);

    case USER_UPDATED: {
      const user = Object.assign({roles: []}, action.user);
      return updateOneById(state, user);
    }

    case USER_DELETED:
      return deleteById(state, action.id);

    default:
      return state;
  }
};
