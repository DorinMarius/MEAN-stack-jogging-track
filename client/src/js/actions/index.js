import $ from 'jquery';

// ===== Error =====
export const ERROR = 'ERROR';

export const error = (err) => {
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

// ===== api =====

// ----- session -----

const API_ROOT = '/api';

export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const login = (email, password) => {
  return dispatch => {
    $.ajax({
      method: 'post',
      url: `${API_ROOT}/users/login`,
      data: {email, password},
      dataType: 'json'
    }).fail(error).
    done((json) => {
      dispatch({
        type: USER_LOGGED_IN,
        token: json.id,
        userId: json.userId
      });
    });
  };
}

export const logout = () => {
  return {
    type: USER_LOGGED_OUT
  }
}
