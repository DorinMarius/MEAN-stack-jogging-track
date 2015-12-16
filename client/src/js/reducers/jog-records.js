import {
  JOG_RECORDS_UPDATED,
  JOG_RECORD_UPDATED,
  JOG_RECORD_DELETED,
} from '../actions';

import {
  updateList,
  updateOneById,
  deleteById
} from './common';

export default (state = [], action) => {
  switch (action.type) {
    case JOG_RECORDS_UPDATED:
      return updateList(state, action.jogRecords);

    case JOG_RECORD_UPDATED:
      return updateOneById(state, action.jogRecord);

    case JOG_RECORD_DELETED:
      return deleteById(state, action.id);

    default:
      return state;
  }
};
