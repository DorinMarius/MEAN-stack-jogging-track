import _ from 'lodash';
import {
  JOG_RECORDS_UPDATED,
  JOG_RECORD_UPDATED,
  JOG_RECORD_DELETED,
} from '../actions';

export default (state = [], action) => {
  switch (action.type) {
    case JOG_RECORDS_UPDATED:
      return action.jogRecords;

    case JOG_RECORD_UPDATED: {
      const r = action.jogRecord;
      const index = _(state).pluck('id').indexOf(r.id);
      if (index < 0) {
        return state.concat([r]);
      } else {
        return state.slice(0, index).
          concat([r]).
          concat(state.slice(index + 1));
      }
    }

    case JOG_RECORD_DELETED: {
      const {id} = action
      return state.filter(r => r.id !== id);
    }

    default:
      return state;
  }
};
