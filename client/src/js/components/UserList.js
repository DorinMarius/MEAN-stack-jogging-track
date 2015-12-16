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

  const list = users.map((user) => (
    <UserCell
      key={user.id}
      user={user}
    />
  ));

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

    return (
      <div>
        <PageHeader>
          User List
        </PageHeader>
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
