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

const $request = ({method, path, data, token}) => {
  return Promise.resolve($.ajax({
    method,
    url: `${API_ROOT}${path}`,
    data,
    dataType: 'json',
    headers: {
      'Authorization': token
    }
  })).catch(handleError);
};

const $get = ({path, token}) => {
  return $request({
    method: 'get',
    path,
    token
  });
};

const $post = ({path, data, token}) => {
  return $request({
    method: 'post',
    path,
    data,
    token
  });
};

const $put = ({path, data, token}) => {
  return $request({
    method: 'put',
    path,
    data,
    token
  });
};

const $delete = ({path, token}) => {
  return $request({
    method: 'delete',
    path,
    token
  });
};

// ===== api =====
const API_ROOT = '/api';

// ----- session -----

export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const login = (email, password) => {
  return dispatch => {
    $post({
      path: '/users/login',
      data: {email, password}
    }).
    then((json) => {
      const token = json.id;
      const userId = json.userId;

      const filter = encodeURIComponent(JSON.stringify({
        include: 'roles'
      }));

      return $get({
        path: `/users/${userId}?filter=${filter}`,
        token
      }).then((json) => {
        return {
          token,
          userId,
          roles: json.roles.map(r => r.name)
        };
      });
    }).
    done(({token, userId, roles}) => {
      dispatch({
        type: USER_LOGGED_IN,
        token,
        userId,
        roles
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
    $post({
      path: '/users',
      data: {email, password}
    }).
    done((json) => {
      login(email, password)(dispatch);
    });
  };
};

// ----- jog records -----
export const JOG_RECORDS_UPDATED = 'JOG_RECORDS_UPDATED';
export const JOG_RECORD_UPDATED = 'JOG_RECORD_UPDATED';
export const JOG_RECORD_DELETED = 'JOG_RECORD_DELETED';

export const fetchAllJogRecords = (userId, token) => {
  return dispatch => {
    $get({
      path: `/users/${userId}/jogRecords`,
      token
    }).
    done((json) => {
      dispatch({
        type: JOG_RECORDS_UPDATED,
        jogRecords: json
      });
    });
  };
};

export const createJogRecord = ({
  date,
  distance,
  time,
  userId,
  token
}) => {
  return dispatch => {
    $post({
      path: `/users/${userId}/jogRecords`,
      data: {date, distance, time},
      token
    }).
    done((json) => {
      dispatch({
        type: JOG_RECORD_UPDATED,
        jogRecord: json
      });
    });
  };
};

export const updateJogRecord = ({
  id,
  date,
  distance,
  time,
  userId,
  token
}) => {
  return dispatch => {
    $put({
      path: `/users/${userId}/jogRecords/${id}`,
      data: {date, distance, time},
      token
    }).
    done((json) => {
      dispatch({
        type: JOG_RECORD_UPDATED,
        jogRecord: json
      });
    });
  };
};

export const deleteJogRecord = ({
  id,
  userId,
  token
}) => {
  return dispatch => {
    $delete({
      path: `/users/${userId}/jogRecords/${id}`,
      token
    }).
    done((json) => {
      dispatch({
        type: JOG_RECORD_DELETED,
        id
      });
    });
  };
};

// ----- users -----
export const USERS_UPDATED = 'USERS_UPDATED';
export const USER_UPDATED = 'USER_UPDATED';
export const USER_DELETED = 'USER_DELETED';

export const fetchAllUsers = (token) => {
  return dispatch => {
    // TODO reduce duplicate code
    const filter = encodeURIComponent(JSON.stringify({
      include: 'roles'
    }));

    $get({
      path: `/users?filter=${filter}`,
      token
    }).
    done((json) => {
      dispatch({
        type: USERS_UPDATED,
        users: json
      });
    });
  };
};

export const createUser = ({
  username,
  email,
  password,
  token
}) => {
  return dispatch => {
    $post({
      path: `/users`,
      data: {username, email, password},
      token
    }).
    done((json) => {
      dispatch({
        type: USER_UPDATED,
        user: json
      });
    });
  };
};

export const updateUser = ({
  id,
  username,
  email,
  password,
  token
}) => {
  return dispatch => {
    $put({
      path: `/users/${id}`,
      data: {username, email, password},
      token
    }).
    done((json) => {
      dispatch({
        type: USER_UPDATED,
        user: json
      });
    });
  };
};

export const deleteUser = ({
  id,
  token
}) => {
  return dispatch => {
    $delete({
      path: `/users/${id}`,
      token
    }).
    done((json) => {
      dispatch({
        type: USER_DELETED,
        id
      });
    });
  };
};
