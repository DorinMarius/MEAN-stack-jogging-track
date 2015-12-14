import {
  JOG_RECORDS_UPDATED
} from '../actions';

export default (state = [], action) => {
  switch (action.type) {
    case JOG_RECORDS_UPDATED:
      return action.jogRecords;

    default:
      return state;
  }
};
