import $ from 'jquery';
import Promise from 'bluebird';

// ===== Error =====
export const handleError = (err) => {
  let msg = err;

  if (err.message) {
    msg = err.message;
  } else if (
    err.responseJSON &&
    err.responseJSON.error
  ) {
    const _err = err.responseJSON.error;
    msg = _err.message || _err.toString();
  }

  alert(msg);
};

const $get = ({path, token}) => {
  return Promise.resolve($.ajax({
    method: 'get',
    url: `${API_ROOT}${path}`,
    dataType: 'json',
    headers: {
      'Authorization': token
    }
  })).catch(handleError);
};

// ===== api =====
const API_ROOT = '/api';

// ----- session -----

export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const login = (email, password) => {
  return dispatch => {
    $.ajax({
      method: 'post',
      url: `${API_ROOT}/users/login`,
      data: {email, password},
      dataType: 'json'
    }).fail(handleError).
    done((json) => {
      dispatch({
        type: USER_LOGGED_IN,
        token: json.id,
        userId: json.userId
      });
    });
  };
};

export const logout = () => {
  return {
    type: USER_LOGGED_OUT
  };
};

export const signup = (email, password) => {
  return dispatch => {
    $.ajax({
      method: 'post',
      url: `${API_ROOT}/users`,
      data: {email, password},
      dataType: 'json'
    }).fail(handleError).
    done((json) => {
      login(email, password)(dispatch);
    });
  };
};

// ----- jog records -----
export const JOG_RECORDS_UPDATED = 'JOG_RECORDS_UPDATED';
export const JOG_RECORD_UPDATED = 'JOG_RECORD_UPDATED';

export const fetchAllJobRecords = (userId, token) => {
  return dispatch => {
    $get({
      path: `/users/${userId}/jogRecords`,
      token
    }).done((json) => {
      dispatch({
        type: JOG_RECORDS_UPDATED,
        jogRecords: json
      });
    });
  };
};
