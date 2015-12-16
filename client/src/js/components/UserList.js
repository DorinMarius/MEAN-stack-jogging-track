import React, {Component} from 'react';
import {connect} from 'react-redux';

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

const UserCell = ({user, onEditBtnClick}) => {
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
        </Col>
      </Row>
    </Panel>
  );
};

const UserList = connect(
  (state) => {
    return {users: state.users};
  }
)(({users}) => {

  const list = _(users).
  map((user) => (
    <UserCell
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

// TODO: reduce duplicate code
const stateToProps = (state) => {
  return {
    session: state.session
  };
};

export default connect(stateToProps)(UserListPage);
