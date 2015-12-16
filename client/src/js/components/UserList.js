import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Editable, exposeSession} from './common';
import {pushState} from 'redux-router';

import {
 fetchAllUsers
} from '../actions';

import {
  Row,
  Col,
  PageHeader,
  Panel,
  Button
} from 'react-bootstrap';

import {
  NewUserForm,
  EditUserForm
} from './user-form';

const UserCell = connect(exposeSession)(({
  data, onEditBtnClick,
  session, dispatch
}) => {
  const user = data;

  const gotoUserJogRecordBtn = _.include(session.roles, 'admin') ?
    <Button
      onClick={() => dispatch(pushState(null, `/users/${user.id}/records`))}
    >Jogging Records</Button> : null;

  return (
    <Panel>
      <Row>
        <Col md={3}>Name: {user.username}</Col>
        <Col md={4}>
          <div>Email: {user.email}</div>
        </Col>
        <Col md={2}>
          <div>Roles: {user.roles.map(r => r.name).join(", ")}</div>
        </Col>
        <Col md={3}>
          <Button
            onClick={onEditBtnClick}
          >
            Edit
          </Button>
          &nbsp;
          {gotoUserJogRecordBtn}
        </Col>
      </Row>
    </Panel>
  );
});

const EditableUserCell = ({user}) => (
  <Editable
    data={user}
    normal={UserCell}
    editing={EditUserForm}
  />
);

const UserList = connect(
  (state) => {
    return {users: state.users};
  }
)(({users}) => {

  const list = _(users).
  map((user) => (
    <EditableUserCell
      key={user.id}
      user={user}
    />
  )).value();

  return (
    <div>
      {list}
    </div>
  );
});

export default class UserListPage extends Component {

  componentDidMount() {
    const {userId, token} = this.props.session;
    const {dispatch} = this.props;
    dispatch(fetchAllUsers(token));
  }

  render() {

    // TODO: remove duplicate code
    const newFormWrapperStyle = {
      marginTop: '40px'
    };

    return (
      <div>
        <PageHeader>
          User List
        </PageHeader>
        <div style={newFormWrapperStyle}>
          <h3>Create New User</h3>
          <NewUserForm />
        </div>
        <UserList />
      </div>
    );

  }

}

export default connect(exposeSession)(UserListPage);
